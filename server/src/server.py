import config
from os import path
from flask_cors import CORS
from werkzeug.exceptions import BadRequest
from flask_restx import Resource, Api, reqparse
from werkzeug.datastructures import FileStorage
from flask import Flask, send_from_directory

from DeepDreamProcess import DeepDreamProcess

basedir = path.abspath(path.dirname(__file__))

server = Flask(__name__)
server.config.from_object(config.DevelopmentConfig)

api = Api(server, prefix=server.config['API_PREFIX'])

CORS(server)

serverReqP = reqparse.RequestParser(
    bundle_errors=True,
    trim=True,
)

deepDreamMaker = DeepDreamProcess()

# only allow images to be proccessed
def allowedFile(fileName):
    return "." in fileName and fileName.rsplit(".", 1)[1].lower() in server.config["ALLOWED_EXTENSIONS"]


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
    localFile = path.join(server.config["UPLOAD_FOLDER"], file.filename)
    file.save(localFile)

    # create new file name
    fileNameParts = path.splitext(file.filename)
    newFileName = fileNameParts[0] + "_dreamyfied" + fileNameParts[1]

    # set saving location for new file
    saveLocation = path.join(server.config["UPLOAD_FOLDER"], newFileName)
    return runDeepDream(localFile, saveLocation, args, newFileName)


def runDeepDream(inputFile, saveLocation, args, newFileName):
    # we do not need this anymore
    args.pop("file")
    deepDreamMaker.setParams(inputFile, saveLocation, args)
    deepDreamMaker.run()
    return {
        "message": "Processing image, this may take a while...",
        "fileName": newFileName,
    }


@api.route("/processImage")
class processImage(Resource):
    def post(self):
        # From POST body
        serverReqP.add_argument("octavescale", type=float, location="form", required=True)
        serverReqP.add_argument("iterations", type=int, location="form", required=True)
        serverReqP.add_argument("octaves", type=int, location="form", required=True)
        serverReqP.add_argument("jitter", type=int, location="form", required=True)
        serverReqP.add_argument("stepsize", type=float, location="form", required=True)
        serverReqP.add_argument("layer", location="form", required=True)
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
        if not deepDreamMaker.isAlive() and deepDreamMaker.hadError():
            raise BadRequest("Something bad happened and we don't know what it was :(")

        return {"progress": str(deepDreamMaker.getProgress())}


@api.route("/getPreviewImage")
class getPreviewImage(Resource):
    def get(self):
        preview = deepDreamMaker.getPreviewImg()
        if preview is not None:
            return {"image": preview[0], "progress": preview[1], "done": False}

        if not deepDreamMaker.isAlive():
            return {"done": True}

        return {"image": "", "done": False}


@api.route("/downloadImage/<string:fileName>")
class downloadImage(Resource):
    def get(self, fileName):
        location = path.join(basedir, server.config["UPLOAD_FOLDER"])
        try:
            return send_from_directory(location, fileName, as_attachment=True)
        except Exception as e:
            raise BadRequest("The file you're trying to download doesn't exist!")


@api.route("/stopDream")
class stopDream(Resource):
    def get(self):
        deepDreamMaker.killProcess()
        deepDreamMaker.clearQueue()
        return {"message": "Dreamed stopped :("}

