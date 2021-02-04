import os
import PIL.Image
import numpy as np
from deepdream import deepdream, net
from multiprocessing import Process, Queue, Value


class DeepDreamProcess:
    def __init__(self, inputImg, outputLoc, args):
        # self.progress = Queue()
        self.progress = Value("i", 0)
        self.previewImg = Queue()
        self.inputImg = inputImg
        self.outputLoc = outputLoc
        self.args = args
        self.totalWork = args["iterations"] * args["octaves"]

    def deepDreamMaker(self, inputImg, outputLoc, args, progress, previewImg):
        print("Running ACTUAL DEEP DREAM")
        image = PIL.Image.open(inputImg).convert("RGB")
        image = np.float32(image)
        # actually run google's deepdream
        dream = deepdream(
            net,
            image,
            args["iterations"],
            args["octaves"],
            args["octaveScale"],
            args["layers"],
            True,
            args["jitter"],
            args["stepSize"],
            progress,
            previewImg,
        )
        self.saveDream(dream)

    def saveDream(self, dream, fmt="JPEG"):
        image = np.uint8(dream)
        PIL.Image.fromarray(image, "RGB").save(self.outputLoc, fmt)
        print("Dream saved to disk")

    def run(self):
        print("Starting DeepDream Thread")
        # self.progress.put(1)
        self.process = Process(
            target=self.deepDreamMaker,
            args=(
                self.inputImg,
                self.outputLoc,
                self.args,
                self.progress,
                self.previewImg,
            ),
        )
        self.process.daemon = True
        self.process.start()
        # self.process.join()  # wait for process

    def isAlive(self):
        return self.process.is_alive()

    def killProcess(self):
        self.process.terminate()

    def getProgress(self):
        p = self.progress.value
        return round(((p * 1.0) / self.totalWork) * 100, 2)

    def getPreviewImg(self):
        if self.previewImg.empty() is False:
            return self.previewImg.get()
        else:
            return None

    def getDreamPath(self):
        return self.outputLoc

    def hadError(self):
        return self.process.exitcode
