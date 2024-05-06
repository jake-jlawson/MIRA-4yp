'''
    DATASET ROUTES (/ds)
    # For manipulating, fetching and using data contained within the dataset
'''
from flask import Blueprint, request, jsonify, g
from database.DataManager import *

#import global variables
from global_vars import global_vars


data_bp = Blueprint('data', __name__) #define blueprint to be imported



# GLOBAL VARIABLES
global DATASETS_SOURCE; #datasets database object
DATASETS_SOURCE = DatasetsDB()

global DATASET #current database
DATASET = ""


'''
    ROUTES:
'''
@data_bp.route('/get-datasets-list', methods=["GET"]) 
# RETRIEVE DATASETS: This route retrieves a list of available datasets
def retrieveDatasets():

    datasets_list = DATASETS_SOURCE.getList()

    return jsonify(datasets_list)


@data_bp.route('/open-dataset', methods=["POST"]) 
# OPEN DATASET: This route opens a dataset in the backend
def openDataset():

    data = request.json

    dataset_name = data.get('name')
    
    global DATASET
    DATASET = Dataset(dataset_name)
    global_vars["DATASET"] = DATASET

    return "Dataset Opened Successfully!"


@data_bp.route('/get-dataset-data', methods=["GET"]) 
# GET DATASET DATA: This route retrieves all of the data currently contained in the open dataset
def getDatasetData():
    
    if (DATASET == ""):
        return "No Dataset open!"
    
    return DATASET.getData()


@data_bp.route('/close-dataset', methods=["GET"]) 
# CLOSE DATASET: This route closes the dataset in the backend once a dataset shouldn't be accesible anymore
def closeDataset():
    
    global DATASET
    DATASET = ""
    global_vars["DATASET"] = DATASET

    return "Dataset Closed"


@data_bp.route('/get-data', methods=["POST"])
# GET DATA: This route recieves a request for a song and a piece of (or multiple pieces) of data from that song
def getData():
    
    incoming_request = request.json


    # parse request
    song_id = incoming_request.get('song_id')
    data = incoming_request.get('data')
    args = incoming_request.get('args')

    print(data)


    # get song from dataset
    song = DATASET.manager.get_song(song_id)

    # get data from song
    if (data in ["main", "vocals", "comp", "bass", "drums"]):
        data_object = song.getAudio(data)

    else:
        data_object = song.getFeature(data)

    
    # Return response
    outgoing_response = {
        "message": "Data Retrieved Successfully!",
        "data": data_object.transmit(args)[0],
        "info": data_object.transmit(args)[1]
    }

    return outgoing_response