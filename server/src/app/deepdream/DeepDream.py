"""
	Google's deep dream python script from github
	https://github.com/google/deepdream

	Originally to be used by a jupyter notebook
	Source code has been modify to work this DeepDream Maker
"""
import os
import base64
import PIL.Image
import numpy as np
from io import BytesIO
from sys import getsizeof
import scipy.ndimage as nd

class DeepDream:
    def __init__(self, net):
        self.net = net

    # a couple of utility functions for converting to and from Caffe's input image layout
    def preprocess(self, img):
        return np.float32(np.rollaxis(img, 2)[::-1]) - self.net.transformer.mean["data"]

    def deprocess(self, img):
        return np.dstack((img + self.net.transformer.mean["data"])[::-1])

    def objective_L2(self, dst):
        dst.diff[:] = dst.data

    def make_step(self, args):
        # Basic gradient ascent step
        src = self.net.blobs["data"]  # input image is stored in Net's 'data' blob
        dst = self.net.blobs[args["layer"]]

        ox, oy = np.random.randint(-args["jitter"], args["jitter"] + 1, 2)
        # apply jitter shift
        src.data[0] = np.roll(np.roll(src.data[0], ox, -1), oy, -2)

        self.net.forward(end=args["layer"])
        # specify the optimization objective
        self.objective_L2(dst)
        self.net.backward(start=args["layer"])
        g = src.diff[0]
        # apply normalized ascent step to the input image
        src.data[:] += args["stepsize"] / np.abs(g).mean() * g
        # unshift image
        src.data[0] = np.roll(np.roll(src.data[0], -ox, -1), -oy, -2)

        #if clip:
        if True:
            bias = self.net.transformer.mean["data"]
            src.data[:] = np.clip(src.data, -bias, 255 - bias)


    def deepdream(self, base_img, args, stop, progress=None, previewImg=None):
        
        # prepare base images for all octaves
        octaves = [self.preprocess(base_img)]
        for i in xrange(args["octaves"] - 1):
            
            if stop.value == 1: return

            octaves.append(
                nd.zoom(octaves[-1], (1, 1.0 / args["octavescale"], 1.0 / args["octavescale"]), order=1)
            )

        src = self.net.blobs["data"]
        # allocate image for network-produced details
        detail = np.zeros_like(octaves[-1])
        # var to keep track of task progress
        totalRuns = 0
        finalRun = args["iterations"] * args["octaves"]

        for octave, octave_base in enumerate(octaves[::-1]):

            if stop.value == 1: return

            h, w = octave_base.shape[-2:]
            if octave > 0:
                # upscale details from the previous octave
                h1, w1 = detail.shape[-2:]
                detail = nd.zoom(detail, (1, 1.0 * h / h1, 1.0 * w / w1), order=1)

            # resize the network's input image size
            src.reshape(1, 3, h, w)
            src.data[0] = octave_base + detail

            for i in xrange(args["iterations"]):

                if stop.value == 1: return

                self.make_step(args)
                # upgrade progress bar
                totalRuns = totalRuns + 1
                progress.value = totalRuns
                # visualization
                if (totalRuns % 10 == 0 or totalRuns == finalRun) and previewImg is not None:

                    if stop.value == 1: return

                    vis = self.deprocess(src.data[0])
                    img = np.uint8(np.clip(vis, 0, 255))
                    buf = BytesIO()
                    PIL.Image.fromarray(img, "RGB").save(buf, format="JPEG")
                    encoded_img = base64.b64encode(buf.getvalue())
                    preImgProgress = round(((totalRuns * 1.0) / finalRun) * 100, 2)
                    previewImg.put([encoded_img, preImgProgress])

        if stop.value == 1: return

        # extract details produced on the current octave
        detail = src.data[0] - octave_base
        # returning the resulting image
        return self.deprocess(src.data[0])
