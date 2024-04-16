'''
    DATASET ROUTES (/ds)
    # For manipulating, fetching and using data contained within the dataset
'''
from flask import Blueprint, request, jsonify, g
from database.DataManager import *

data_bp = Blueprint('data', __name__) #define blueprint to be imported



# GLOBAL VARIABLES
global DATASETS_SOURCE; #datasets database object
DATASETS_SOURCE = DatasetsDB()

global DATASET #current database
DATASET = ""


'''
    ROUTES:
'''
@data_bp.route('/getdata', methods=["POST"])
def process():
    print("Hello World!")
    
    test_data = request.data.decode('utf-8')
    print(test_data)
    return test_data + 'You have made a request to the Dataset Processing Route'


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

    return "Dataset Closed"