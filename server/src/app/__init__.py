import config
from flask import Flask
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(config.Config)
    CORS(app)
    
    with app.app_context():
        # Import and register blueprints
        from .api import routes
        app.register_blueprint(routes, url_prefix=app.config['API_PREFIX'])
        return app

