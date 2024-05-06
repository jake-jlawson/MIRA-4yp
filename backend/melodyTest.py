from backend.modules.DefaultModules.SPMelodyExtractor import *
from modules.ProcessingTypes import *
from database.DataManager import Dataset

import librosa.display
import matplotlib.pyplot as plt
import numpy as np

ds1 = Dataset("ds1")
song = ds1.manager.get_song("84a7ffde9137e11ed123bdbd92019c79")
songAudio = Audio(song.audioData["vocals"], duration=60, sr=44100)

songAudio.threshold(0.05)


#Melody Extractor Inputs
module_inputs = {
    "audio_in": songAudio
}

fig, (ax1, ax2) = plt.subplots(2, sharex=True, figsize=(10, 6))
ax1.plot()


#Visualise Input
librosa.display.waveshow(module_inputs["audio_in"].source, color="blue", ax=ax1, sr=44100)



#Run Melody Extractor
melody_extractor = SPMelodyExtractor()
melody_output = melody_extractor.process(module_inputs)


ax2.plot(melody_output["melody"].contour[0], melody_output["melody"].contour[1], label='f0', color='cyan', linewidth=2)
plt.show()










