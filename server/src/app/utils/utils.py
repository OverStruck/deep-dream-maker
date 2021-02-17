from os import path, makedirs
from flask import current_app
from werkzeug.exceptions import BadRequest

from app.deepdream import deepDreamMaker

# only allow images to be proccessed
def allowedFile(fileName):
    return (
        "." in fileName
        and fileName.rsplit(".", 1)[1].lower()
        in current_app.config["ALLOWED_EXTENSIONS"]
    )


# make sure file is valid
def checkFile(file=None):
    if file is None:
        raise BadRequest("No image selected")

    # filename may be empty, don't know why
    if file.filename == "":
        raise BadRequest("Invalid image")

    # check if file has image extension
    if not allowedFile(file.filename):
        raise BadRequest("Image file format not supported")

    return {"OK": True}


def processFile(args):
    file = args["file"]
    # save file
    localFile = path.join(current_app.config["UPLOAD_FOLDER"], file.filename)
    if not path.isdir(current_app.config["UPLOAD_FOLDER"]):
        makedirs(current_app.config["UPLOAD_FOLDER"])
    file.save(localFile)

    # create new file name
    fileNameParts = path.splitext(file.filename)
    newFileName = fileNameParts[0] + "_dreamyfied" + fileNameParts[1]

    # set saving location for new file
    saveLocation = path.join(current_app.config["UPLOAD_FOLDER"], newFileName)
    return runDeepDream(localFile, saveLocation, args, newFileName)


def runDeepDream(inputFile, saveLocation, args, newFileName):
    # we do not need this anymore
    args.pop("file")
    # actually process the image
    deepDreamMaker.setParams(inputFile, saveLocation, args)
    deepDreamMaker.run()
    # while we wait for the image to be done processing, return this
    return {
        "message": "Processing image, this may take a while...",
        "fileName": newFileName,
    }