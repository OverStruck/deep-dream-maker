import os
class Config(object):
    ENV = os.environ["FLASK_ENV"]
    DEBUG = os.environ["FLASK_DEBUG"]
    TESTING = False
    UPLOAD_FOLDER = "user_images"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
    API_PREFIX = "/api/v1"
