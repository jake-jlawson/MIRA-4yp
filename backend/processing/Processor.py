'''
    PROCESSOR
    # Classes for enacting the data processing pipeline
'''
# PYTHON IMPORTS
import typing, os, importlib.util, threading
from queue import Queue
from collections import deque
import networkx as nx
import matplotlib.pyplot as plt

# MODULE IMPORTS
from database.DataManager import *
from modules.ProcessingTypes import *
from processing.ProgressUpdates import ProgressEmitter


'''
    PROCESSING CHAIN: Defines a graphs structure for the processing chain
'''
class ProcessingChain():
    def __init__(self, chain_nodes, chain_edges, modules):
        # Construct processing chain as a graph data structure
        self.chain = self.construct(chain_nodes, chain_edges, modules)


    # CONSTRUCT PROCESSING CHAIN NODE STRUCTURE - from nodes and edges data
    def construct(self, nodes, edges, modules):
        chain = nx.MultiDiGraph()

        print(modules)

        #instantiate nodes
        for node in nodes:
            node_id = node["id"]
            node_module_name = node["data"]["module_name"]
            node_module = modules[node_module_name] #get module from loaded_modules
            
            chain.add_node(node_id, node_obj=ProcessingNode(node, node_module))

        #instantiate edges
        for edge in edges:
            edge_source = edge["source"]
            edge_target = edge["target"]
            
            chain.add_edge(edge_source, edge_target, edge_obj=ProcessingEdge(edge))

        return chain


    # VISUALISE PROCESSING CHAIN GRAPH
    def visualise(self):
        nx.draw_spring(self.chain, with_labels=True)
        plt.show()
    


'''
    NODES AND EDGES: Defines objects with all necessary features to perform the operations of nodes and edges
'''
class ProcessingNode():
#Defines a processing node. This must contain a processing module.
    def __init__(self, node_data, module):
        
        #Node attributes
        self.id = node_data["id"]
        self.inputs = node_data["data"]["module_inputs"]
        self.module_name = node_data["data"]["module_name"]
        
        #Instantiate the Node processing module
        module_class = getattr(module, self.module_name)
        self.module = module_class()


    def run(self, inputs):
        return self.module.process(inputs)


class ProcessingEdge():
#Defines a processing edge. This must be labelled with a variable and data type.
    def __init__(self, edge_data):
        self.target = edge_data["target"]
        self.source_var = edge_data["sourceHandle"].replace("handle-", "")
        self.target_var = edge_data["targetHandle"].replace("handle-", "")



'''
    PROCESSOR: Provides functionality for carrying out the execution of a processing chain on the dataset
'''
class Processor():

    def __init__(self, processing_chain: ProcessingChain, dataset: Dataset):
        self.chain = processing_chain.chain
        self.dataset_obj = dataset
        self.dataset = dataset.db

        self.process_layers = list(nx.topological_generations(self.chain)) #get layers to execute

        self.emitter = ProgressEmitter()
        
    
    def execute(self, iters=-1):
        
        dataset_info = (self.dataset).info()
        dataset_entries = dataset_info["doc_count"] #count dataset entries


        # If max iterations set, iterate through the whole dataset
        if (iters == -1) or (iters > dataset_entries):

            for db_id in self.dataset:
                source = SongSource()
                song = source.load(self.dataset, db_id)

                self.run_chain(song) #run the processing chain
                
                (self.emitter).emit_progress(1, "Chain run on " + song.title)
            
            (self.emitter).emit_complete()
            return
        
        # If specific number of iterations set, iterate that many times
        else:
            iteration_count=0

            for db_id in self.dataset:
                source = SongSource()
                song = source.load(self.dataset, db_id)

                self.run_chain(song) #run the processing chain


                iteration_count += 1

                (self.emitter).emit_progress(1, "Chain run on " + song.title)

                if iteration_count >= iters:
                    break  # Exit the loop if the maximum limit is reached
            
            (self.emitter).emit_complete()
            return
        

    def run_chain(self, song):
        threads = []
        module_data = ModuleDataStore(self.chain)


        # worker function to implement task in threads and pass data
        def node_worker(node_name, data, inputs):
            
            node = self.chain.nodes[node_name]
            node_object = node["node_obj"] #get the node object

            (self.emitter).emit_progress(0, "Running " + node_object.module_name + "...")


            #Handle special modules
            match node_object.module_name:
                case "Demix":
                    result = node_object.module.process(inputs, dataset=self.dataset_obj, song=song)

                case "SimpleSource":
                    result = node_object.module.process(inputs, song=song)

                case _:
                    result = node_object.run(inputs)
            

            #map outgoing edges to correct module data
            out_edges = self.chain.out_edges(node_name, data=True)

            for edge in out_edges:
                edge_obj = edge[2]["edge_obj"]
                
                source_var = edge_obj.source_var
                edge_data = result[source_var] #data to send along the edge

                data.update(edge_obj.target, edge_obj.target_var, edge_data)

        
            return result


        # Process chains in layers
        for layer in (self.process_layers):

            # print("Current Module Data:")
            # print(module_data.dict)

            if len(layer) > 1:
            # run several threads if the layer is larger than 1 node
                
                for task in layer:
                    inputs = module_data.pop(task)

                    thread = threading.Thread(target=node_worker, args=(task, module_data, inputs))

                    threads.append(thread)
                    thread.start()
            
            else:
            # run node if there is only one node in the layer
                inputs = module_data.pop(layer[0])
                result = node_worker(layer[0], module_data, inputs)

            # Wait for all threads to complete
            for thread in threads:
                thread.join()

            
class ModuleDataStore(): #class to store module input data
    def __init__(self, chain):
        self.dict = {}
        self.lock = threading.Lock()

        #initialise the queue with the modules in the processing chain
        for node in chain.nodes:
            node_object = chain.nodes[node]["node_obj"]

            empty_input = {key: None for key in node_object.inputs}
            
            self.put(node, empty_input)

    
    # Update an input value in the module data store
    def update(self, node_id, input_name, input_data):
        with self.lock:
            (self.dict)[node_id][input_name] = input_data


    # Add data to the module data store
    def put(self, key, value):
        with self.lock:
            self.dict[key] = value


    # Pop data from module data store
    def pop(self, node_id):
        with self.lock:
            value = self.dict[node_id]
            self.dict.pop(node_id)

        return value

        

    


    









