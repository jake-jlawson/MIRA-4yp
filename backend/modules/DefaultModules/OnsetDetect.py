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


MODULE_NAME = "OnsetDetect" #Module Name (must be the same as the class)
TYPES = {
    "source": "SRC",
    "utility": "UTIL",
    "event0": "E0",
    "event1": "E1"
}
__all__ = [MODULE_NAME] 


# FURTHER IMPORTS


# ---MODULE INTERFACE
class OnsetDetect(ProcessingModule):
    
    # Exposes interface to the system (UI and backend) - be careful with this
    module_name = MODULE_NAME
    module_type = TYPES["event0"]
    module_inputs = {
        "audio_in": Audio,
    }
    module_outputs = {
        "onsets_env": TimeSeries,
        "onsets": TimeStamps,
    }
    module_params = {}
    

    def __init__(self):
        self.PARAM_DEFAULTS = {} #set default parameters
        return
    

    def process(self, inputs: dict, params: dict = {}) -> dict:
        
        # Get inputs and parameters
        src_audio = inputs["audio_in"].mono_src()
        sr = inputs["audio_in"].sr


        # get onset envelope
        onset_env = librosa.onset.onset_strength(y=src_audio, sr=sr)
        times = librosa.times_like(onset_env, sr=sr)

        #get onsets
        onsets = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr, units='time')

        print(onsets, flush=True)


        return {
            "onsets_env": TimeSeries(times, onset_env),
            "onsets": TimeStamps(onsets)
        } #return value should be a dict in the same form as module_outputs



# FURTHER CODE REQUIRED FOR MODULE GOES HERE

