
import os
import PIL.Image
import numpy as np
from DeepDream import DeepDream
from google.protobuf import text_format
from multiprocessing import Process, Queue, Value

###########################################
# turn off caffe logging to console
# The levels are
# 0 - debug
# 1 - info (still a LOT of outputs)
# 2 - warnings
# 3 - errors
###########################################

os.environ['GLOG_minloglevel'] = '2' 
import caffe


class DeepDreamProcess:
    def __init__(self):
        self.stop = Value("i", 0)
        self.progress = Value("i", 0)
        self.previewImage = Queue()
        self.net = self.loadNet()
        self.process = None

    def loadNet(self):
        
        # set up correct path for required files
        fn = "caffe/deploy.prototxt"
        fn2 = "caffe/bvlc_googlenet.caffemodel"
        net_fn = os.path.join(os.path.dirname(__file__), fn)
        param_fn = os.path.join(os.path.dirname(__file__), fn2)

        if not os.path.exists("tmp.prototxt"):
            # Patching model to be able to compute gradients.
            # Note that you can also manually add "force_backward: true" line to "deploy.prototxt".
            model = caffe.io.caffe_pb2.NetParameter()
            text_format.Merge(open(net_fn).read(), model)
            model.force_backward = True
            open("tmp.prototxt", "w").write(str(model))
        
        return caffe.Classifier(
            "tmp.prototxt",
            param_fn,
            # ImageNet mean, training set dependent
            mean=np.float32([104.0, 116.0, 122.0]),
            # the reference model has channels in BGR order instead of RGB
            channel_swap=(2, 1, 0),
        )

    def setParams(self, inputImage, outputLocation, args):
        self.args = args
        self.inputImage = inputImage
        self.outputLocation = outputLocation
        self.totalWork = args["iterations"] * args["octaves"]

    def deepDreamMaker(self, args, stop, inputImage, progress, previewImg):
        print("Running ACTUAL DEEP DREAM")
        image = PIL.Image.open(inputImage).convert("RGB")
        image = np.float32(image)
        # actually run google's deepdream
        dd = DeepDream(self.net)
        dream = dd.deepdream(
            image,
            args,
            stop,
            progress,
            previewImg,
        )
        if self.stop.value == 1:
            print("DeepDream stopped by user")
        else:
            self.saveDream(dream)

    def saveDream(self, dream, fmt="JPEG"):
        image = np.uint8(dream)
        PIL.Image.fromarray(image, "RGB").save(self.outputLocation, fmt)
        print("Dream saved to disk")

    def run(self):
        # reset flags
        self.stop.value = 0
        self.progress.value = 0
        
        print("Starting DeepDream Process")
        self.process = Process(
            target=self.deepDreamMaker,
            args=(
                self.args,
                self.stop,
                self.inputImage,
                self.progress,
                self.previewImage,
            ),
        )
        self.process.daemon = True
        self.process.start()

    def isAlive(self):
        return self.process.is_alive()

    def getPid(self):
        return self.process.pid

    def killProcess(self):
        self.stop.value = 1
        self.process.terminate()
        self.process.join()

    def getProgress(self):
        p = self.progress.value
        progress = round(((p * 1.0) / self.totalWork) * 100, 2)
        if progress == 100.0: self.progress.value = 0
        return progress

    def getPreviewImg(self):
        if self.previewImage.empty() is False:
            return self.previewImage.get()
        else:
            return None

    def getDreamPath(self):
        return self.outputLocation

    def hadError(self):
        return self.process.exitcode

    def clearQueue(self):
        while not self.previewImage.empty():
            self.previewImage.get()

