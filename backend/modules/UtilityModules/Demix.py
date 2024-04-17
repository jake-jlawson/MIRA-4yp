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

__all__ = ["Demix"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS


# Processing Module Interface Definition
class Demix(ProcessingModule):

    module_name = "Demix"
    module_type = "UTIL"

    module_inputs = {
        "source_audio": Audio,
    } #takes and audio source as an input

    module_outputs = {
        "main":Audio,
        "vocals": Audio,
        "comp": Audio,
        "bass": Audio,
        "drums": Audio
    } #returns 4 parts: vocals, accompaniment, bass, drums

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

