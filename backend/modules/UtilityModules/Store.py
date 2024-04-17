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


# Processing Module Interface Definition
class Store(ProcessingModule):

    module_name = "Store"
    module_type = "STORE"

    module_inputs = {
        "data": Any,
    } #takes in any datatype to store in the database

    module_outputs = {} 

    module_params = {}
    

    def __init__(self):
        return
    

    def process(sourceAudio: Audio):
        return {
            "vocals": [],
            "accompaniment": [],
            "bass": [],
            "drums": []
        }




# Any further code required by the processing module

