from flask import Blueprint
from flask_restx import Api

routes = Blueprint("routes", __name__)
api = Api(routes)

from .stopDream import *
from .getProgress import *
from .processImage import *
from .downloadImage import *
from .getPreviewImage import *