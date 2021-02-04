"""
    DeepDreamWrapper Script
    This script wraps around the original Google python script
    It provides some added funcionality like argument parsing
    We do this to keep the "source" (Google's Python Script) as independent
    as possible from our own code. Doing makes it easier to update Google's code
    should an update be released.
"""

import os
import PIL.Image
import numpy as np
from deepdream import deepdream, net


def saveDream(image, filePath, fmt="JPEG"):
    """
    Save dreamified image.
    Independent of the user output file name, the extension will always be JPEG
    """
    image = np.uint8(image)
    PIL.Image.fromarray(image, "RGB").save(filePath, fmt)


def deepDreamMaker(inputImg, outputLoc, args, progress):
    image = PIL.Image.open(inputImg).convert("RGB")
    image = np.float32(image)
    # actually run google's deepdream
    dreamifiedImg = deepdream(
        net,
        image,
        args["iterations"],
        args["octaves"],
        args["octaveScale"],
        args["layers"],
        True,
        args["jitter"],
        args["stepSize"],
        progress=None,
    )
    # save file
    saveDream(dreamifiedImg, outputLoc)
