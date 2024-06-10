from flask import Flask
from flask_cors import CORS

from config import config

# Routes 
from routes import Book 

app = Flask(__name__)

CORS(app)
# CORS(app, resources={"*":{"origins": "https://localhost:9300/"}})

if __name__ == '__main__':
    app.config.from_object(config['development'])

    # Blueprints
    app.register_blueprint(Book.main, url_prefix='/api/books')
    #Ejecutar la aplicación
    app.run()

