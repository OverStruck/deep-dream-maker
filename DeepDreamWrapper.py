"""
    DeepDreamWrapper Script
    This script wraps around the original Google python script
    It provides some added funcionality like argument parsing
    We do this to keep the "source" (Google's Python Script) as independent
    as possible from our own code. Doing makes it easier to update Google's code
    should an update be released.
"""

import os
import argparse
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

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Deep Dream Maker")
    parser.add_argument("-img", "--inputImage", help="Input image file name", required=True)
    parser.add_argument("-oimg", "--outputImage", help="Output image file name")
    #parser.add_argument("-i","--inputFolder", help="Input directory",required=True)
    #parser.add_argument("-o","--outputFolder",help="Output directory", required=True)
    parser.add_argument("-oct","--octaves",help="Octaves. Default: 4", type=int, required=False,  default=4)
    parser.add_argument("-octs","--octaveScale",help="Octave Scale. Default: 1.4", type=float, required=False,  default=1.4)
    parser.add_argument("-itr","--iterations",help="Iterations. Default: 10", type=int, required=False,  default=10)
    parser.add_argument("-j","--jitter",help="Jitter. Default: 32", type=int, required=False,  default=32)
    parser.add_argument("-s","--stepSize",help="Step Size.  Default: 1.5", type=float, required=False,  default=1.5)
    parser.add_argument("-l","--layers",help="Layers Loop. Default: inception_4c/output", type=str, required=False,  default="inception_4c/output")

    args = parser.parse_args()

    if args.inputImage == None or os.path.isfile(args.inputImage) == False:
        print "Error: No source image"
        exit()

    #if args.outputFolder == None or os.path.exists(args.outputFolder) == False:
        #print "Error: No output folder"
        #exit()

	#open image     
    image = np.float32(PIL.Image.open(args.inputImage))
    #actually run google's deepdream
    dreamifiedImg = deepdream(net, image, args.iterations, args.octaves, args.octaveScale, args.layers, True)
    #save our image
    saveDream(dreamifiedImg, args.outputImage)