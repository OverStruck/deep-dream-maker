import os
from flask_cors import CORS, cross_origin
from werkzeug.exceptions import BadRequest
from deepDreamProcess import DeepDreamProcess
from flask_restx import Resource, Api, reqparse
from werkzeug.datastructures import FileStorage
from flask import Flask, jsonify, request, send_from_directory

UPLOAD_FOLDER = "./user_images"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

server = Flask(__name__)
server.debug = True
server.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
# server.config["ERROR_INCLUDE_MESSAGE"] = False

api = Api(server, prefix="/api/v1")

CORS(server)

serverReqP = reqparse.RequestParser(
    bundle_errors=True,
    trim=True,
)

# only allow images to be proccessed
def allowedFile(fileName):
    return "." in fileName and fileName.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


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
    localFile = os.path.join(server.config["UPLOAD_FOLDER"], file.filename)
    file.save(localFile)
    deepDreamArgs = {
        "iterations": args["iterations"],
        "octaves": args["octaves"],
        "octaveScale": args["octavescale"],
        "layers": "inception_4c/output",
        "jitter": args["jitter"],
        "stepSize": args["stepsize"],
    }
    fileNameParts = os.path.splitext(file.filename)
    newFileName = fileNameParts[0] + "_dreamyfied" + fileNameParts[1]
    saveLocation = os.path.join(server.config["UPLOAD_FOLDER"], newFileName)
    return runDeepDream(localFile, saveLocation, deepDreamArgs, newFileName)


def runDeepDream(inputFile, saveLocation, args, newFileName):
    global dd
    dd = DeepDreamProcess(inputFile, saveLocation, args)
    dd.run()
    return {
        "message": "Processing image, this may take a while...",
        "fileName": newFileName,
    }


@api.route("/processImage")
class processImage(Resource):
    def post(self):
        # From POST body
        serverReqP.add_argument(
            "octavescale", type=float, location="form", required=True
        )
        serverReqP.add_argument("iterations", type=int, location="form", required=True)
        serverReqP.add_argument("octaves", type=int, location="form", required=True)
        serverReqP.add_argument("jitter", type=int, location="form", required=True)
        serverReqP.add_argument("stepsize", type=float, location="form", required=True)
        # From file uploads
        serverReqP.add_argument(
            "file",
            type=FileStorage,
            required=True,
            location="files",
            help="You did not selected an image to process.",
        )

        args = serverReqP.parse_args(strict=True)

        # sanity check
        isFileValid = checkFile(args["file"])
        if isFileValid["OK"]:
            return processFile(args)


@api.route("/getProgress")
class getProgress(Resource):
    def get(self):
        global dd
        if not dd.isAlive() and dd.hadError():
            raise BadRequest("Something bad happened and we don't know what it was :(")

        return {"progress": str(dd.getProgress())}


@api.route("/getPreviewImage")
class getPreviewImage(Resource):
    def get(self):
        global dd
        preview = dd.getPreviewImg()
        if preview is not None:
            return {"image": preview[0], "progress": preview[1], "done": False}

        if not dd.isAlive():
            return {"done": True}

        return {"image": "", "done": False}


@api.route("/downloadImage/<string:fileName>")
class downloadImage(Resource):
    def get(self, fileName):
        location = os.path.join(os.getcwd(), server.config["UPLOAD_FOLDER"])
        try:
            return send_from_directory(location, fileName, as_attachment=True)
        except Exception as e:
            raise BadRequest("The file you're trying to download doesn't exist!")


@api.route("/stopDream")
class stopDream(Resource):
    def get(self):
        global dd
        dd.killProcess()
        return {"message": "Dreamed stopped :("}


if __name__ == "__main__":
    server.run(host="0.0.0.0", debug=True)
