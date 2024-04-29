'''
    PROCESSING ROUTES
    # For carrying out data processing in the application
'''
from flask import Blueprint, request, jsonify
from processing.ModuleManager import *
from processing.Processor import *

#import global variables
from global_vars import global_vars


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


@processing_bp.route('/get-modules', methods=["GET"])
# RETRIEVE MODULES: This route retrieves a list of available processing modules
def getModules():

    MODULE_MANAGER.reload()
    json_serialisable_modules_list = MODULE_MANAGER.getModules()
    # print(json_serialisable_modules_list, flush=True)

    return jsonify(json_serialisable_modules_list)


@processing_bp.route('/run-system', methods=["POST"])
# RUN SYSTEM: This route recieves the processing chain and runs it
def runSystem():

    chain_data = request.json
    chain_nodes = chain_data["nodes"]
    chain_edges = chain_data["edges"]
    print(chain_nodes, flush=True)

    processing_chain = ProcessingChain(chain_nodes, chain_edges, modules=MODULE_MANAGER.loaded_modules)
    processing_chain.visualise()

    processor = Processor(processing_chain, global_vars["DATASET"])
    processor.execute(iters=1)


    return "System Running!"

