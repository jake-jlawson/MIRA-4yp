'''
    PROCESSING MODULE: DEMIX
    Module takes in an audio object and returns 4 other audio objects that represent the parts of the song after demixing.
    The demixing algorithm used is: __________

    Created by: Jake Lawson
    MIRA Default Module
'''

# PROCESSING MODULE IMPORTS
from modules.ProcessingModule import *
from modules.ProcessingTypes import * 

__all__ = ["LowPass"] #must be set to your module name to ensure only the module interface is available for import

# ANY FURTHER IMPORTS


# Processing Module Interface Definition
class LowPass(ProcessingModule):

    module_name = "LowPass"
    module_type = "PRE"

    module_inputs = {
        "audio_in": Audio
    } #takes and audio source as an input

    module_outputs = {
        "audio_out": Audio
    } #returns 4 parts: vocals, accompaniment, bass, drums
    

    def __init__(self):
        return
    

    def process(sourceAudio: Audio):
        return {
            "audio_out": [],
        }




# Any further code required by the processing module

