from . import api
from flask_restx import Resource
from app.deepdream import deepDreamMaker

@api.route("/getPreviewImage")
class GetPreviewImage(Resource):
    def get(self):
        preview = deepDreamMaker.getPreviewImg()
        if preview is not None:
            return {"image": preview[0], "progress": preview[1], "done": False}

        if not deepDreamMaker.isAlive():
            return {"done": True}
        
        return {"image": "", "done": False}