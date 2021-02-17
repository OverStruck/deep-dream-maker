from . import api
from flask_restx import Resource
from app.deepdream import deepDreamMaker
from werkzeug.exceptions import BadRequest

@api.route("/getProgress")
class GetProgress(Resource):
    def get(self):
        if not deepDreamMaker.isAlive() and deepDreamMaker.hadError():
            raise BadRequest("DeepDream process is dead. There's no progress to get")

        return {"progress": str(deepDreamMaker.getProgress())}