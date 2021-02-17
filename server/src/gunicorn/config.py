##############################
# gunicorn config file
##############################

import os

ENVIRONMENT = os.environ["FLASK_ENV"]
DEBUG = os.environ["FLASK_DEBUG"]
HOST = os.environ["FLASK_RUN_HOST"]
PORT = ":5000"

##############################
# gunicorn specific settings
##############################
bind = HOST + PORT
workers = 1
worker_tmp_dir = "/dev/shm"
preload_app = True

# debug = True if in dev env
debug = DEBUG
# hot reaload if in dev env
reload = DEBUG
accesslog = "/dev/stdout" if DEBUG is False else None
loglevel = "debug" if DEBUG is False else "info"
disable_redirect_access_to_syslog = DEBUG

proc_name = "DeepDream Maker Server"