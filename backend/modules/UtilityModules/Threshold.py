'''
    Threshold Pre-processing Module
    This module applies a threshold to an audio signal
'''
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 

MODULE_NAME = "Threshold" #Module Name (must be the same as the class and unique)
TYPES = {
    "source": "SRC",
    "pre-processing": "PRE",
    "utility": "UTIL",
    "event0": "E0",
    "event1": "E1"
}
__all__ = [MODULE_NAME] 



# ---THRESHOLD MODULE INTERFACE
class Threshold(ProcessingModule):
    
    # Exposes interface to the system (UI and backend) - be careful with this
    module_name = MODULE_NAME
    module_type = TYPES["pre-processing"]
    module_inputs = {
        "input": Audio
    }
    module_outputs = {
        "output": Audio
    }
    module_params = {
        "Threshold Amount": [0, 1]
    }
    

    def __init__(self):
        super().__init__()
        self.PARAM_DEFAULTS = {
            "Threshold Amount": 0
        }
    

    def process(self, inputs: dict, params: dict = {}) -> dict:
        print("Threshold Running!")
        
        # Get inputs and parameters
        audio_in = inputs["input"]
        amount = params.get("Threshold Amount", self.PARAM_DEFAULTS["Threshold Amount"])


        return {
            "output": audio_in.threshold(amount),
        } #return value should be a dict in the same form as module_outputs

