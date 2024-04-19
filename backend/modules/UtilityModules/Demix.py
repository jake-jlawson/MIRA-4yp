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
import os
import demucs.api
from pathlib import Path



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

    module_params = [
        {
            "name": "Demixing Algorithm",
            "type": "select",
            "options": ["Default"]
        }
    ]
    


    def __init__(self):
        return
    

    # MAIN PROCESSING INTERFACE
    def process(self, inputs: dict, dataset, song):
        print("Demixer Running!") 

        source_audio = inputs["source_audio"]
        audio_src_path = source_audio.source_path #get file location for the audio

        self.demix_out_folder = os.path.dirname(audio_src_path)
        self.song = song
        self.dataset = dataset

        # Data template to return
        self.data_out = {"main": Audio(audio_src_path), "vocals": None, "comp": None, "bass": None, "drums": None}


        # Check if the song has already been demixed
        if "comp" in self.song.audioData:
            self.data_out["vocals"] = Audio(song.audioData["vocals"])
            self.data_out["comp"] = Audio(song.audioData["comp"])
            self.data_out["bass"] = Audio(song.audioData["bass"])
            self.data_out["drums"] = Audio(song.audioData["drums"])

        else: # demix if not
            demixed_parts = self.demix(audio_src_path)
            self.save_parts(demixed_parts)

        print(self.data_out)
        return self.data_out

    
    # RUN AUDIO SEPARATION
    def demix(self, audio_src):
        
        self.separator = demucs.api.Separator(progress=True)
        _, separated = self.separator.separate_audio_file(audio_src)

        return separated.items()
    

    # SAVE SEPARATED PARTS TO DATASET, FILESYSTEM AND OUTPUT
    def save_parts(self, separated_parts):
        for key, value in separated_parts:
            
            # change "other" to "comp"
            if (key == "other"):
                part = "comp"
            else:
                part = key

            file_name = part + '.wav'
            file_loc = os.path.join(self.demix_out_folder, file_name)

            self.song.audioData[part] = file_loc #update dataset
            self.data_out[part] = Audio(file_loc) #update module outputs

            #Save Data to folder
            demucs.api.save_audio(value, path=file_loc, samplerate=self.separator.samplerate)

        #update song in dataset
        self.song.store(self.dataset.db)


