from . import api
from os import path, getcwd
from flask_restx import Resource
from flask import current_app, send_from_directory
from werkzeug.exceptions import BadRequest

@api.route("/downloadImage/<string:fileName>")
class DownloadImage(Resource):
    def get(self, fileName):
        location = path.join(getcwd(), current_app.config["UPLOAD_FOLDER"])
        try:
            return send_from_directory(location, fileName, as_attachment=True, cache_timeout=0)
        except Exception as e:
            raise BadRequest("The file you're trying to download doesn't exist!")