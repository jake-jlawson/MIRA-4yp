'''
    SPMelodyExtractor
    This module extracts melody using classical signal processing techniques
'''
from modules.Modules import ProcessingModule
from modules.ProcessingTypes import * 

MODULE_NAME = "SPMelodyExtractor" #Module Name (must be the same as the class)
TYPES = {
    "source": "SRC",
    "utility": "UTIL",
    "event0": "E0",
    "event1": "E1"
}

__all__ = [MODULE_NAME] #must be set to only your module name to ensure only the module interface is available for import


# FURTHER IMPORTS
import numpy as np
from abc import ABC, abstractmethod
from modules.UtilityModules.Threshold import Threshold


# ---SPMELODYEXTRACTOR INTERFACE
class SPMelodyExtractor(ProcessingModule):
    
    # Expose interface to the system (UI and backend)
    module_name = "SPMelodyExtractor"
    module_type = "E1"
    module_inputs = {
        "audio_in": Audio
    }
    module_outputs = {
        "melody_out": Melody
    }
    module_params = {
        "algorithm": ["PYIN", "YIN"],
        "threshold": [0, 1]
    }
    

    def __init__(self):
        super().__init__()
        self.PARAM_DEFAULTS = {
            "algorithm": "PYIN",
            "threshold": 0.05
        } #set default parameters
        
        
    
    #Processing Function - function to implement melody processing
    def process(self, inputs: dict, params: dict = {}):
        print("MelodyExtractor Running!")

        # Get inputs and parameters
        audio_in = inputs["audio_in"]
        threshold_amount = params.get("threshold", self.PARAM_DEFAULTS["threshold"])
        algorithm = params.get("algorithm", self.PARAM_DEFAULTS["algorithm"])

        # Set algorithm
        self.set_algorithm(globals()[algorithm](audio_in))


        # Threshold Audio
        threshold_module = Threshold()
        audio_in = threshold_module.process({"input": audio_in}, {"Threshold Amount": threshold_amount})["output"]

        # Compute melody contour
        contour = self.compute_contour()


        # Compute MIDI representation (pitch quantization)


        return {"melody_out": Melody(contour=contour)}


    # Context Strategy Setter - set melody processing algorithm
    def set_algorithm(self, algorithm): #algorithm setter
        self.algorithm = algorithm

    def compute_contour(self): #algorithm runner
        return self.algorithm.run()
    


# ---IMPLEMENTATION OF DIFFERENT MELODY PROCESSING ALGORITHMS
class MelodyAlgorithm(ABC): # strategy base class for melody algorithms
    
    def __init__(self, audio_in):
        self.input = audio_in.source
        self.sr = audio_in.sr

    @abstractmethod
    def run(self):
        pass

class PYIN(MelodyAlgorithm):
    def __init__(self, audio_in):
        super().__init__(audio_in)
    
    def run(self):
        sample_rate = self.sr

        melody_contour, voiced_flag, voiced_probs = librosa.pyin(
            self.input, 
            fmin=librosa.note_to_hz('C2'), 
            fmax=librosa.note_to_hz('C7'),
            sr=sample_rate
        )

        times = librosa.times_like(melody_contour, sr=sample_rate)
        
        return [times, melody_contour]
    
class YIN(MelodyAlgorithm):
    def __init__(self, audio_in):
        super().__init__(audio_in)
    
    def run(self):
        sample_rate = self.sr

        melody_contour = librosa.yin(
            self.input, 
            fmin=librosa.note_to_hz('C2'), 
            fmax=librosa.note_to_hz('C7'),
            sr=sample_rate
        )

        times = librosa.times_like(melody_contour, sr=sample_rate)
        
        return [times, melody_contour]


