from modules.Modules import ProcessingModule
from modules.ProcessingTypes import *

from modules.UtilityModules.SimpleSource import *

from database.DataManager import *
from processing.Processor import *
from processing.ModuleManager import *



# Testing
ds = Dataset("ds1") # define dataset to run on
MODULE_MANAGER = ModuleManager()
MODULE_MANAGER.load()


processing_chain_nodes = [{'id': 'node_7', 'type': 'moduleNode', 'position': {'x': 386.7335249762018, 'y': 256.5337695959132}, 'data': {'id': 3.1, 'label': 'Demix', 'module_inputs': {'source_audio': 'Audio'}, 'module_name': 'Demix', 'module_outputs': {'bass': 'Audio', 'comp': 'Audio', 'drums': 'Audio', 'main': 'Audio', 'vocals': 'Audio'}, 'module_params': {}, 'module_type': 'UTIL'}, 'width': 147, 'height': 189, 'selected': False, 'positionAbsolute': {'x': 386.7335249762018, 'y': 256.5337695959132}, 'dragging': False}, {'id': 'node_8', 'type': 'srcNode', 'position': {'x': 206.9898605808944, 'y': 314.9050857450478}, 'data': {'id': 3.1, 'label': 'SimpleSource', 'module_inputs': {}, 'module_name': 'SimpleSource', 'module_outputs': {'source_audio': 'Audio'}, 'module_params': {}, 'module_type': 'SRC'}, 'width': 119, 'height': 69, 'selected': True, 'positionAbsolute': {'x': 206.9898605808944, 'y': 314.9050857450478}, 'dragging': False}, {'id': 'node_9', 'type': 'moduleNode', 'position': {'x': 694.6419382598901, 'y': 137.6247565426208}, 'data': {'id': 1.1, 'label': 'MelodyExtractor', 'module_inputs': {'audio_in': 'Audio'}, 'module_name': 'MelodyExtractor', 'module_outputs': {'melody': 'MIDI'}, 'module_params': {}, 'module_type': 'E0'}, 'width': 178, 'height': 109, 'selected': False, 'positionAbsolute': {'x': 694.6419382598901, 'y': 137.6247565426208}, 'dragging': False}, {'id': 'node_10', 'type': 'moduleNode', 'position': {'x': 700.4996257435148, 'y': 294.5442646498509}, 'data': {'id': 1.1, 'label': 'MelodyExtractor', 'module_inputs': {'audio_in': 'Audio'}, 'module_name': 'MelodyExtractor', 'module_outputs': {'melody': 'MIDI'}, 'module_params': {}, 'module_type': 'E0'}, 'width': 178, 'height': 109, 'selected': False, 'positionAbsolute': {'x': 700.4996257435148, 'y': 294.5442646498509}, 'dragging': False}, {'id': 'node_11', 'type': 'moduleNode', 'position': {'x': 681.4149112149385, 'y': 449.5973746809334}, 'data': {'id': 1.1, 'label': 'MelodyExtractor', 'module_inputs': {'audio_in': 'Audio'}, 'module_name': 'MelodyExtractor', 'module_outputs': {'melody': 'MIDI'}, 'module_params': {}, 'module_type': 'E0'}, 'width': 178, 'height': 109, 'selected': False, 'positionAbsolute': {'x': 681.4149112149385, 'y': 449.5973746809334}, 'dragging': False}, {'id': 'node_13', 'type': 'preNode', 'position': {'x': 578.3547760644798, 'y': 327.83944353802985}, 'data': {'id': 3.1, 'label': 'AutoPass', 'module_inputs': {'input': 'Audio'}, 'module_name': 'AutoPass', 'module_outputs': {'output': 'Audio'}, 'module_params': {}, 'module_type': 'PRE'}, 'width': 104, 'height': 60, 'selected': False, 'positionAbsolute': {'x': 578.3547760644798, 'y': 327.83944353802985}, 'dragging': False}, {'id': 'node_14', 'type': 'moduleNode', 'position': {'x': 992.4303389718286, 'y': 265.9632849989605}, 'data': {'id': 1.1, 'label': 'MelodicGrouping', 'module_inputs': {'melody1': 'MIDI', 'melody2': 'MIDI', 'melody3': 'MIDI'}, 'module_name': 'MelodicGrouping', 'module_outputs': {'melodic_groups': 'MIDI'}, 'module_params': {}, 'module_type': 'E1'}, 'width': 183, 'height': 149, 'selected': False, 'positionAbsolute': {'x': 992.4303389718286, 'y': 265.9632849989605}, 'dragging': False}, {'id': 'node_15', 'type': 'storeNode', 'position': {'x': 1227.1425314013902, 'y': 336.9210783151964}, 'data': {'id': 3.1, 'label': 'Store', 'module_inputs': {'data': 'Any'}, 'module_name': 'Store', 'module_outputs': {}, 'module_params': {}, 'module_type': 'STORE'}, 'width': 111, 'height': 24, 'selected': False, 'positionAbsolute': {'x': 1227.1425314013902, 'y': 336.9210783151964}, 'dragging': False}]
processing_chain_edges = [{'source': 'node_8', 'sourceHandle': 'handle-source_audio', 'target': 'node_7', 'targetHandle': 'handle-source_audio', 'id': 'reactflow__edge-node_8handle-source_audio-node_7handle-source_audio'}, {'source': 'node_7', 'sourceHandle': 'handle-comp', 'target': 'node_13', 'targetHandle': 'handle-input', 'id': 'reactflow__edge-node_7handle-comp-node_13handle-input'}, {'source': 'node_13', 'sourceHandle': 'handle-output', 'target': 'node_10', 'targetHandle': 'handle-audio_in', 'id': 'reactflow__edge-node_13handle-output-node_10handle-audio_in'}, {'source': 'node_7', 'sourceHandle': 'handle-bass', 'target': 'node_9', 'targetHandle': 'handle-audio_in', 'id': 'reactflow__edge-node_7handle-bass-node_9handle-audio_in'}, {'source': 'node_7', 'sourceHandle': 'handle-vocals', 'target': 'node_11', 'targetHandle': 'handle-audio_in', 'id': 'reactflow__edge-node_7handle-vocals-node_11handle-audio_in'}, {'source': 'node_9', 'sourceHandle': 'handle-melody', 'target': 'node_14', 'targetHandle': 'handle-melody1', 'id': 'reactflow__edge-node_9handle-melody-node_14handle-melody1'}, {'source': 'node_10', 'sourceHandle': 'handle-melody', 'target': 'node_14', 'targetHandle': 'handle-melody2', 'id': 'reactflow__edge-node_10handle-melody-node_14handle-melody2'}, {'source': 'node_11', 'sourceHandle': 'handle-melody', 'target': 'node_14', 'targetHandle': 'handle-melody3', 'id': 'reactflow__edge-node_11handle-melody-node_14handle-melody3'}, {'source': 'node_14', 'sourceHandle': 'handle-melodic_groups', 'target': 'node_15', 'targetHandle': 'handle-data', 'id': 'reactflow__edge-node_14handle-melodic_groups-node_15handle-data'}]




chain = ProcessingChain(processing_chain_nodes, processing_chain_edges, MODULE_MANAGER.loaded_modules) # define new processing chain



newProcessor = Processor(chain, ds) # create a processor
newProcessor.execute(iters=1) #executive processing chain
chain.visualise()





