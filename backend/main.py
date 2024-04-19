'''
    BACKEND SERVER - Main File
    # Defines the main process that serves the backend

    # The MIRA backend is responsible for database and module management, as well as processing tasks
'''

# PACKAGE IMPORTS 
from flask import Flask
from database.DataManager import *



app = Flask(__name__) #define app




# IMPORT ROUTES
from routes.processing_routes import processing_bp
app.register_blueprint(processing_bp, url_prefix='/processing') #processing routes

from routes.data_routes import data_bp
app.register_blueprint(data_bp, url_prefix='/ds') #dataset routes (for managing the dataset)



# GENERAL ROUTES
@app.route('/test')
def hello():
    return "Hello World!"



'''
    RUN SERVER
'''
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=2000)