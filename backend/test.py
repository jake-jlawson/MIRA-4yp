from backend.modules.Modules import *
from modules.ProcessingTypes import *

from modules.UtilityModules.SimpleSource import *

from database.DataManager import *
from processing.Processor import *



# Testing
ds = Dataset("ds1") # define dataset to run on
chain = ProcessingChain() # define new processing chain
newProcessor = Processor(chain, ds) # create a processor

newProcessor.execute(iters=1) #executive processing chain



