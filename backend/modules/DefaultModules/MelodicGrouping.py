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
__all__ = ["HarmonicAnalyser"] #must be set to only your module name to ensure only the module interface is available for import


# FURTHER IMPORTS


# Processing Module Interface Definition
class MelodicGrouping(ProcessingModule):
    module_name = "MelodicGrouping"
    module_type = "E1"
    module_inputs = {
        "melody1": MIDI,
        "melody2": MIDI,
        "melody3": MIDI
    }
    module_outputs = {
        "melodic_groups": MIDI
    }
    module_params = {}
    
    def __init__(self):
        return
    
    def process(self, inputs: dict, params: dict = {}):
        print("Melodic Grouping Running!")

        print(inputs)

        return {
            "melodic_groups": "These are some melodic groups"
        }



# Any further code required by the processing module

