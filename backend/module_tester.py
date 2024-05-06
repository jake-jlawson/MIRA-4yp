from modules.ProcessingTypes import *
from processing.ModuleManager import *
from database.DataManager import Dataset

import matplotlib.pyplot as plt


#Get a dataset and module manager
global DATASET;
dataset = "ds1"
DATASET = Dataset(dataset)

global MODULE_MANAGER;
MODULE_MANAGER = ModuleManager()
modules = MODULE_MANAGER.load() #load modules into object



class ModuleTester():
    def __init__(self, data, module_name):
        
        self.inputs = data["inputs"]
        self.params = data["params"]
        
        module_class = getattr(modules[module_name], module_name)
        self.module = module_class()
        

    def test(self):
        
        output = (self.module).process(inputs=(self.inputs), params=(self.params))
        
        return output
    



global song_to_run;
song = DATASET.manager.get_song("84a7ffde9137e11ed123bdbd9201a231")
song_to_run = song.vocalsAudio(duration=30, sr=44100)

'''----------------------------------
    #----TEST SP MELODY EXTRACTOR
-----------------------------------'''
def testSPMelodyExtractor():
    data = {"inputs": {"audio_in": song_to_run}, "params": {"algorithm": "PYIN"}} #test data
    melody_extractor = ModuleTester(data, "SPMelodyExtractor")
    test_output = melody_extractor.test()["melody"]

    # plot test
    fig, (ax1, ax2) = plt.subplots(2, sharex=True, figsize=(10, 6))
    ax1.plot()

    #Visualise Test
    librosa.display.waveshow(data["inputs"]["audio_in"].source, color="blue", ax=ax1, sr=44100) #visualise input
    ax1.set_title('Input Signal')  # Add title for the first subplot
    ax2.plot(test_output.times, test_output.contour, label='f0', color='red', linewidth=2) #visualise output
    ax2.set_title('Output Melody Contour')  # Add title for the first subplot
    plt.show()

def compareMelodyAlgos():
    data1 = {"inputs": {"audio_in": song_to_run}, "params": {"algorithm": "PYIN"}} #test data
    data2 = {"inputs": {"audio_in": song_to_run}, "params": {"algorithm": "YIN"}} #test data

    pyin_melody_extractor = ModuleTester(data1, "SPMelodyExtractor")
    yin_melody_extractor = ModuleTester(data2, "SPMelodyExtractor")
    pyin_output = pyin_melody_extractor.test()["melody"]
    yin_output = yin_melody_extractor.test()["melody"]

    # plot test
    fig, (ax1, ax2, ax3) = plt.subplots(3, sharex=True, figsize=(10, 6))
    ax1.plot()

    #Visualise Test
    librosa.display.waveshow(data1["inputs"]["audio_in"].source, color="blue", ax=ax1, sr=44100) #visualise input
    ax1.set_title('Input Signal')  # Add title for the first subplot
    ax2.plot(pyin_output.times, pyin_output.contour, label='f0', color='red', linewidth=2) #visualise output
    ax2.set_title('Output Melody Contour (PYIN)')  # Add title for the first subplot
    ax3.plot(yin_output.times, yin_output.contour, label='f0', color='red', linewidth=2) #visualise output
    ax3.set_title('Output Melody Contour (YIN)')  # Add title for the first subplot
    plt.show()


'''--------------------------
    #----TEST THRESHOLD
-----------------------------'''
def testThreshold():
    data = {"inputs": {"input": song_to_run}, "params": {"Threshold Amount": 0.1}} #test data


    #Visualise input
    fig, (ax1, ax2) = plt.subplots(2, sharex=True, sharey=True, figsize=(10, 6))
    ax1.plot()
    librosa.display.waveshow(data["inputs"]["input"].source, color="blue", ax=ax1, sr=44100) #visualise input
    ax1.set_title('Input Signal (Before Threshold)')  # Add title for the first subplot


    #Run module
    test_output = ModuleTester(data, "Threshold").test()["output"]


    #Visualise Output
    librosa.display.waveshow(test_output.source, color="orange", ax=ax2, sr=44100) #visualise output
    ax2.set_title('Output Signal (After) Threshold)')  # Add title for the first subplot
    plt.show()



testSPMelodyExtractor()