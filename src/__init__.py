from flask import Flask 
from src.routes import main_bp
from src.utils.config import SECRET_KEY

# Function to create and configure the Flask app
def create_app():
    app = Flask(__name__) 
    app.secret_key = SECRET_KEY
    # Register the main_bp blueprint with the app
    app.register_blueprint(main_bp, url_prefix='/')

    return app
