'''
    PROCESSING MODULE: DEMIX
    Module takes in an audio object and returns 4 other audio objects that represent the parts of the song after demixing.
    The demixing algorithm used is: __________

    Created by: Jake Lawson
    MIRA Default Module
'''

# PROCESSING MODULE IMPORTS
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 
from typing import Any

__all__ = ["Store"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS
import threading


# Processing Module Interface Definition
class Store(ProcessingModule):

    module_name = "Store"
    module_type = "STORE"

    module_inputs = {
        "data": Any,
    } #takes in any datatype to store in the database

    module_outputs = {} 

    module_params = {
        "featureID": ""
    }
    

    def __init__(self):
        self.lock = threading.Lock()
        super().__init__()
    

    def process(self, inputs: dict, params: dict, dataset, song: SongSource):
        
        store_data = inputs["data"]
        store_data_type = type(store_data).__name__

        # set feature attributes and data
        feature_name = params["featureID"]
        feature_data = store_data.format()

        feature_packet = {"type": store_data_type, "data": feature_data}


        self.lock.acquire()
        try:
        # store feature in the dataset
            song.features[feature_name] = feature_packet
            song.store(dataset)
            print("Data Stored!")
        finally:
            self.lock.release()

        

