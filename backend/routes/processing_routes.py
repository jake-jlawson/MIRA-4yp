'''
    PROCESSING ROUTES
    # For carrying out data processing in the application
'''
from flask import Blueprint, jsonify
from processing.ModuleManager import *

processing_bp = Blueprint('processing', __name__) #define blueprint to be imported


# GLOBAL VARIABLES
global MODULE_MANAGER; # set up a module manager for the processing routes
MODULE_MANAGER = ModuleManager()


'''
    ROUTES:
'''
@processing_bp.route('/test')
def test():
    return 'Processing Route Test Succeeded!'


@processing_bp.route('get-modules')
# RETRIEVE MODULES: This route retrieves a list of available processing modules
def getModules():

    MODULE_MANAGER.reload()
    json_serialisable_modules_list = MODULE_MANAGER.getModules()
    # print(json_serialisable_modules_list, flush=True)

    return jsonify(json_serialisable_modules_list)

