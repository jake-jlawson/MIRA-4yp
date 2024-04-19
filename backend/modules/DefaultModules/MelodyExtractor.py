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
__all__ = ["MelodyExtractor"] #must be set to only your module name to ensure only the module interface is available for import


# FURTHER IMPORTS


# Processing Module Interface Definition
class MelodyExtractor(ProcessingModule):
    module_name = "MelodyExtractor"
    module_type = "E0"
    module_inputs = {
        "audio_in": Audio
    }
    module_outputs = {
        "melody": MIDI
    }
    module_params = {}
    
    def __init__(self):
        return

    def process(self, inputs: dict):
        print("MelodyExtractor Running!")
        print(inputs)

        return {
            "melody": "This is a melody!"
        }


# Any further code required by the processing module

