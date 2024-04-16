# PYTHON IMPORTS
import typing
import os
import importlib.util

# MODULE IMPORTS
from database.DataManager import *
from modules.UtilityModules import SimpleSource
from modules.ProcessingTypes import *


class ProcessingChain():
    def __init__(self):
        return

    def getRequiredModules():
        return
    

class ProcessingNode():
#Defines a processing node. This must contain a processing module.
    def __init__(self, module):
        self.module = module
    

class ProcessingEdge():
#Defines a processing edge. This must be labelled with a variable and data type.
    def __init__(self):
        return




class Processor():

    def __init__(self, chain: ProcessingChain, dataset: Dataset):
        self.chain = chain
        self.dataset = dataset.db
    

    def execute(self, iters=-1):
        
        dataset_info = (self.dataset).info()
        dataset_entries = dataset_info["doc_count"] #count dataset entries


        # If max iterations set, iterate through the whole dataset
        if (iters == -1) or (iters > dataset_entries):
            for db_id in self.dataset:
                source = SongSource()
                song = source.load(self.dataset, db_id)

                self.run_chain(song)
            return
        
        # If specific number of iterations set, iterate that many times
        else:
            iteration_count=0

            for db_id in self.dataset:
                source = SongSource()
                song = source.load(self.dataset, db_id)

                self.run_chain(song)


                iteration_count += 1
                if iteration_count >= iters:
                    break  # Exit the loop if the maximum limit is reached
            
            return
        

    def run_chain(self, song):
        print(song)

    


    









