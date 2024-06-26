'''
    [PROCESSING MODULE NAME]
    [Description of what the processing module does]

    [Other metadata for processing module]
'''

'''
    RULES:
    ! - __all__ must contain only 1 module and it must be the interface of your module
    ! - The class must define information, such as module_name, module_type, module_inputs and module_outputs
    ! - The main interface class must have the same name as the file
'''
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 

MODULE_NAME = "ChordExtractor" #Module Name (must be the same as the class)
TYPES = {
    "source": "SRC",
    "utility": "UTIL",
    "event0": "E0",
    "event1": "E1"
}

__all__ = [MODULE_NAME] #must be set to only your module name to ensure only the module interface is available for import


# FURTHER IMPORTS


# Processing Module Interface Definition
class ChordExtractor(ProcessingModule):
    module_name = MODULE_NAME
    module_type = TYPES["event1"]
    module_inputs = {
        "audio_in": Audio
    }
    module_outputs = {
        "chords": MIDI
    }

    module_params = {}
    

    def __init__(self):
        return
    

    def process(self, inputs: dict, params: dict = {}) -> dict:
        return {
            "chords": []
        } #return value should be a dict in the same form as module_outputs



# Any further code required by the processing module

