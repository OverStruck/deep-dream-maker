class Config(object):
    DEBUG = False
    TESTING = False
    UPLOAD_FOLDER = "user_images"
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
    API_PREFIX = "/api/v1"

class DevelopmentConfig(Config):
    DEBUG = True

class TestingConfig(Config):
    TESTING = True