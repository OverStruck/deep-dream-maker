"""
	Google's deep dream python script from github
	https://github.com/google/deepdream

	Originally to be used by a jupyter notebook
	We have removed out all unnecesary code
"""

import io
import base64

import sys
import caffe
import PIL.Image
import numpy as np
import scipy.ndimage as nd
from google.protobuf import text_format

net_fn = "deploy.prototxt"
param_fn = "bvlc_googlenet.caffemodel"

# Patching model to be able to compute gradients.
# Note that you can also manually add "force_backward: true" line to "deploy.prototxt".
model = caffe.io.caffe_pb2.NetParameter()
text_format.Merge(open(net_fn).read(), model)
model.force_backward = True
open("tmp.prototxt", "w").write(str(model))

net = caffe.Classifier(
    "tmp.prototxt",
    param_fn,
    # ImageNet mean, training set dependent
    mean=np.float32([104.0, 116.0, 122.0]),
    channel_swap=(2, 1, 0),
)  # the reference model has channels in BGR order instead of RGB

# a couple of utility functions for converting to and from Caffe's input image layout


def preprocess(net, img):
    return np.float32(np.rollaxis(img, 2)[::-1]) - net.transformer.mean["data"]


def deprocess(net, img):
    return np.dstack((img + net.transformer.mean["data"])[::-1])


def objective_L2(dst):
    dst.diff[:] = dst.data


def make_step(
    net,
    step_size=1.5,
    end="inception_4c/output",
    jitter=32,
    clip=True,
    objective=objective_L2,
):
    # Basic gradient ascent step
    src = net.blobs["data"]  # input image is stored in Net's 'data' blob
    dst = net.blobs[end]

    ox, oy = np.random.randint(-jitter, jitter + 1, 2)
    # apply jitter shift
    src.data[0] = np.roll(np.roll(src.data[0], ox, -1), oy, -2)

    net.forward(end=end)
    # specify the optimization objective
    objective(dst)
    net.backward(start=end)
    g = src.diff[0]
    # apply normalized ascent step to the input image
    src.data[:] += step_size / np.abs(g).mean() * g
    # unshift image
    src.data[0] = np.roll(np.roll(src.data[0], -ox, -1), -oy, -2)
    if clip:
        bias = net.transformer.mean["data"]
        src.data[:] = np.clip(src.data, -bias, 255 - bias)


def deepdream(
    net,
    base_img,
    iter_n=10,
    octave_n=4,
    octave_scale=1.4,
    end="inception_4c/output",
    clip=True,
    jitter=32,
    stepSize=1.5,
    progress=None,
    previewImg=None,
    **step_params
):

    # prepare base images for all octaves
    octaves = [preprocess(net, base_img)]
    for i in xrange(octave_n - 1):
        octaves.append(
            nd.zoom(octaves[-1], (1, 1.0 / octave_scale, 1.0 / octave_scale), order=1)
        )

    src = net.blobs["data"]
    # allocate image for network-produced details
    detail = np.zeros_like(octaves[-1])
    # var to keep track of task progress
    totalRuns = 0
    finalRun = iter_n * octave_n
    for octave, octave_base in enumerate(octaves[::-1]):
        h, w = octave_base.shape[-2:]
        if octave > 0:
            # upscale details from the previous octave
            h1, w1 = detail.shape[-2:]
            detail = nd.zoom(detail, (1, 1.0 * h / h1, 1.0 * w / w1), order=1)

        # resize the network's input image size
        src.reshape(1, 3, h, w)
        src.data[0] = octave_base + detail

        for i in xrange(iter_n):
            make_step(
                net,
                end=end,
                clip=clip,
                jitter=jitter,
                step_size=stepSize,
                **step_params
            )
            # upgrade progress bar
            totalRuns = totalRuns + 1
            progress.value = totalRuns
            # progress.put(totalRuns)
            # visualization
            if (
                totalRuns % 10 == 0 or totalRuns == finalRun
            ) and previewImg is not None:
                vis = deprocess(net, src.data[0])
                img = np.uint8(np.clip(vis, 0, 255))
                buf = io.BytesIO()
                PIL.Image.fromarray(img, "RGB").save(buf, format="JPEG")
                encoded_img = base64.b64encode(buf.getvalue())
                preImgProgress = round(((totalRuns * 1.0) / finalRun) * 100, 2)
                previewImg.put([encoded_img, preImgProgress])

            # adjust image contrast if clipping is disabled
            if not clip:
                vis = vis * (255.0 / np.percentile(vis, 99.98))

    # extract details produced on the current octave
    detail = src.data[0] - octave_base
    # returning the resulting image
    return deprocess(net, src.data[0])
