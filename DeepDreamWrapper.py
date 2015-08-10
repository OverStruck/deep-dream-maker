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

def saveDream(image, filePath, fmt='JPEG'):
    """
        Save dreamified image.
        Independent of the user output file name, the extension will always be JPEG
    """
    image = np.uint8(image)
    PIL.Image.fromarray(image, "RGB").save(filePath, fmt)

def deepDreamMaker(killProcess, inputImg, outputLoc, args, progressBarQueue = None, previewImgQueue=None):
    #print "Dreaming in process id: ", os.getpid()

    image = PIL.Image.open(inputImg).convert("RGB")
    #image.thumbnail( (500, 500), PIL.Image.ANTIALIAS)
    image = np.float32(image)
    #actually run google's deepdream
    dreamifiedImg = deepdream(killProcess, net, image, args["iterations"], args["octaves"], args["octaveScale"], 
        args["layers"], True, progressBarQueue, previewImgQueue, args["jitter"], args["stepSize"])
   
    #if not killProcess.value:
    
    saveDream(dreamifiedImg, outputLoc)