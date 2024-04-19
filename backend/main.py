'''
    BACKEND SERVER - Main File
    # Defines the main process that serves the backend

    # The MIRA backend is responsible for database and module management, as well as processing tasks
'''

# PACKAGE IMPORTS 
from flask import Flask
from database.DataManager import *
from flask_socketio import SocketIO
from global_vars import global_vars



app = Flask(__name__) #define app
socketio = SocketIO(app)
global_vars["SOCKETIO"] = socketio




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
    socketio.run(app, host='127.0.0.1', port=2000, allow_unsafe_werkzeug=True)