from . import api
from flask_restx import Resource
from app.deepdream import deepDreamMaker

@api.route("/stopDream")
class stopDream(Resource):
    def get(self):
        deepDreamMaker.clearQueue()
        deepDreamMaker.killProcess()
        return {"message": "Dreamed stopped :("}