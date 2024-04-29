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
import numpy as np


# Processing Module Interface Definition
class MelodyExtractor(ProcessingModule):
    module_name = "MelodyExtractor"
    module_type = "E0"
    module_inputs = {
        "audio_in": Audio
    }
    module_outputs = {
        "melody": Melody
    }
    module_params = {}
    
    def __init__(self):
        return


    def process(self, inputs: dict):
        print("MelodyExtractor Running!")
        print(inputs)

        # Get inputs
        audio_in = inputs["audio_in"]

        # Compute Melody Contour
        extractor = pyinExtractor(audio_in)
        contour = extractor.process()


        # Compute Melody Midi


        return {
            "melody": Melody(contour=contour)
        }
    

    def get_contour(self):
        return


# Any further code required by the processing module
class pyinExtractor():
    def __init__(self, audio_source):
        self.audio = audio_source
        self.src = audio_source.source

    def process(self):
        sample_rate = self.audio.sr
        
        melody_contour, voiced_flag, voiced_probs = librosa.pyin(
            self.src, 
            fmin=librosa.note_to_hz('C2'), 
            fmax=librosa.note_to_hz('C7'),
            sr=sample_rate)
        
        times = librosa.times_like(melody_contour, sr=sample_rate)
        
        return [times, melody_contour]
    

class midiExtractor():
    def __init__(self, audio_source):
        self.audio = audio_source
        self.src = audio_source.source

    def process(self):
        sample_rate = self.audio.sr

        


        return

