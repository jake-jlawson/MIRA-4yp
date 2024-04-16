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
from modules.ProcessingModule import *
from modules.ProcessingTypes import * 
__all__ = ["UserModule1"] #must be set to only your module name to ensure only the module interface is available for import


# FURTHER IMPORTS


# Processing Module Interface Definition
class UserModule1(ProcessingModule):
    module_name = "UserModule1"
    module_type = ""
    module_inputs = {}
    module_outputs = {}
    
    def __init__():
        return



# Any further code required by the processing module

