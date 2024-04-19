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

__all__ = ["LowPass"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS


# Processing Module Interface Definition
class LowPass(ProcessingModule):

    module_name = "LowPass"
    module_type = "PRE"
    
    module_inputs = {
        "input": Audio
    }

    module_outputs = {
        "output": Audio
    }

    module_params = {}


    def __init__(self):
        super().__init__()
        print(self, flush=True)
        return
    

    def process():
        
        print("LowPass Running!")
        
        return {
            "output": [],
        }




# Any further code required by the processing module

