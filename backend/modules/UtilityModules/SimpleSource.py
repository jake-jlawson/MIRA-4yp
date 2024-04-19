'''
    SOURCE (Simple)
    This is a utility module, it does not perform processing, it simply acts as the source of our processing chain
    This is a simple source because it just outputs audio data from a song object, to output multiple features, use Source (Complex) instead

    RULES:
    - 
'''

# PROCESSING MODULE IMPORTS
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 

__all__ = ["SimpleSource"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS


# Processing Module Interface Definition
class SimpleSource(ProcessingModule):

    # Module information
    module_name = "SimpleSource"
    module_type = "SRC"

    module_inputs = {}

    module_outputs = {
        "source_audio": Audio
    }

    module_params = {}


    def __init__(self):
        return


    def process(self, inputs: dict):

        print("SimpleSource module running!")
        
        return {
            "source_audio": "This is some source audio"
        }
