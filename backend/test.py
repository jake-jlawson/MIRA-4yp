from modules.Modules import ProcessingModule
from modules.ProcessingTypes import *

from modules.UtilityModules.SimpleSource import *

from database.DataManager import *
from processing.Processor import *
from processing.ModuleManager import *

from modules.UtilityModules.Demix import *

import os
os.environ["TORCH_HOME"] = "C:/Users/jacob/Desktop/4th Year Project/4yp/backend/models"



# Testing
ds = Dataset("ds1") # define dataset to run on
MODULE_MANAGER = ModuleManager()
MODULE_MANAGER.load()


source = SongSource()
song_to_process = source.load(ds.db, "84a7ffde9137e11ed123bdbd9201a231")
demixer_module = Demix()
out = demixer_module.process({"source_audio": Audio("D:/4YP/Datasets\\ds1\\Shawn Mendes - Stitches\\audioData\\main.wav")}, ds, song_to_process)

print(out)





