'''
    [PROCESSING MODULE NAME]
    [Description of what the processing module does]

    [Other metadata for processing module]
'''

'''
    ~~RULES:
    ! - __all__ must contain only 1 module and it must be the interface of your module
    ! - The class must define information, such as module_name, module_type, module_inputs and module_outputs
    ! - The main interface class must have the same name as the file
'''
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 


MODULE_NAME = "ModuleName" #Module Name (must be the same as the class)
TYPES = {
    "source": "SRC",
    "utility": "UTIL",
    "event0": "E0",
    "event1": "E1"
}
__all__ = [MODULE_NAME] 


# FURTHER IMPORTS


# ---MODULE INTERFACE
class ModuleName(ProcessingModule):
    
    # Exposes interface to the system (UI and backend) - be careful with this
    module_name = MODULE_NAME
    module_type = TYPES[""]
    module_inputs = {}
    module_outputs = {}
    module_params = {}
    

    def __init__(self):
        self.PARAM_DEFAULTS = {} #set default parameters
        return
    

    def process(self, inputs: dict, params: dict = {}) -> dict:
        
        # Get inputs and parameters
        
        return {} #return value should be a dict in the same form as module_outputs



# FURTHER CODE REQUIRED FOR MODULE GOES HERE

