from . import api
from app.utils import checkFile, processFile

from flask_restx import Resource, reqparse
from werkzeug.datastructures import FileStorage

@api.route("/processImage")
class ProcessImage(Resource):
    def post(self):
        parser = reqparse.RequestParser(bundle_errors=True, trim=True)
        # From POST body
        parser.add_argument("octavescale", type=float, location="form", required=True)
        parser.add_argument("iterations", type=int, location="form", required=True)
        parser.add_argument("octaves", type=int, location="form", required=True)
        parser.add_argument("jitter", type=int, location="form", required=True)
        parser.add_argument("stepsize", type=float, location="form", required=True)
        parser.add_argument("layer", location="form", required=True)
        # From file uploads
        parser.add_argument(
            "file",
            type=FileStorage,
            required=True,
            location="files",
            help="You did not selected an image to process.",
        )

        args = parser.parse_args(strict=True)

        # sanity check
        isFileValid = checkFile(args["file"])
        if isFileValid["OK"]:
            return processFile(args)