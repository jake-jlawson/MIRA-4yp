'''
    Store Module
    Module stores features when they are needed
'''

# PROCESSING MODULE IMPORTS
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 
from typing import Any

__all__ = ["Store"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS
import threading
import simplejson as json


# ---STORE MODULE INTERFACE
class Store(ProcessingModule):

    # Expose interface to the system (UI and backend)
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
    

    def process(self, inputs: dict, dataset, song: SongSource, params: dict = {}):
        print("Store Module Running!")

        # Get data to store
        store_data = inputs["data"]
        store_data_type = type(store_data).__name__
        
        # set feature attributes and data
        feature_name = params["featureID"]
        feature_data = store_data.format()[0]
        feature_info = store_data.format()[1]

        store_data_loc = os.path.join(song.path, "features", feature_name + ".json") # file location to store feature data

        feature_packet = {"type": store_data_type, "data": store_data_loc, "info": feature_info}


        self.lock.acquire()
        try:
        # store feature in the dataset and file system
            
            # Store in filesystem
            file_loc = os.path.join(song.path, "features", feature_name + ".json")
            with open(file_loc, "w") as f:
                json.dump(feature_data, f, allow_nan=False)

            # Store in database
            song.features[feature_name] = feature_packet
            song.store(dataset)
            print("Data Stored!")

        finally:
            self.lock.release()

        

