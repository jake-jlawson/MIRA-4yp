from modules.Modules import ProcessingModule
from modules.ProcessingTypes import *

from database.DataManager import *
from processing.Processor import *
from processing.ModuleManager import *


MODULE_MANAGER = ModuleManager()
modules = MODULE_MANAGER.load()

ds = Dataset("ds1")

nodes = [
                {
                    "id": "node_1",
                    "type": "srcNode",
                    "position": {
                        "x": 387.80389537439464,
                        "y": 263.36048889160156
                    },
                    "data": {
                        "id": 3.1,
                        "label": "SimpleSource",
                        "module_inputs": {},
                        "module_name": "SimpleSource",
                        "module_outputs": {
                            "source_audio": "Audio"
                        },
                        "module_params": {},
                        "module_type": "SRC"
                    },
                    "width": 119,
                    "height": 69,
                    "positionAbsolute": {
                        "x": 387.80389537439464,
                        "y": 263.36048889160156
                    },
                },
                {
                    "id": "node_2",
                    "type": "moduleNode",
                    "position": {
                        "x": 544.204261058297,
                        "y": 210.94097237744074
                    },
                    "data": {
                        "id": 3.1,
                        "label": "Demix",
                        "module_inputs": {
                            "source_audio": "Audio"
                        },
                        "module_name": "Demix",
                        "module_outputs": {
                            "bass": "Audio",
                            "comp": "Audio",
                            "drums": "Audio",
                            "main": "Audio",
                            "vocals": "Audio"
                        },
                        "module_params": [
                            {
                                "name": "Demixing Algorithm",
                                "options": [
                                    "Default"
                                ],
                                "type": "select"
                            }
                        ],
                        "module_type": "UTIL"
                    },
                    "width": 147,
                    "height": 189,
                    "positionAbsolute": {
                        "x": 544.204261058297,
                        "y": 210.94097237744074
                    },
                },
                {
                    "id": "node_3",
                    "type": "preNode",
                    "position": {
                        "x": 752.2080016963012,
                        "y": 103.50222910152979
                    },
                    "data": {
                        "id": 3.1,
                        "label": "LowPass",
                        "module_inputs": {
                            "input": "Audio"
                        },
                        "module_name": "LowPass",
                        "module_outputs": {
                            "output": "Audio"
                        },
                        "module_params": {},
                        "module_type": "PRE"
                    },
                    "width": 101,
                    "height": 60,
                    "positionAbsolute": {
                        "x": 752.2080016963012,
                        "y": 103.50222910152979
                    },
                },
                {
                    "id": "node_4",
                    "type": "moduleNode",
                    "position": {
                        "x": 878.9640155163253,
                        "y": 69.6995593500319
                    },
                    "data": {
                        "id": 1.1,
                        "label": "MelodyExtractor",
                        "module_inputs": {
                            "audio_in": "Audio"
                        },
                        "module_name": "MelodyExtractor",
                        "module_outputs": {
                            "melody": "MIDI"
                        },
                        "module_params": {},
                        "module_type": "E0"
                    },
                    "width": 178,
                    "height": 109,
                    "positionAbsolute": {
                        "x": 878.9640155163253,
                        "y": 69.6995593500319
                    },
                },
                {
                    "id": "node_5",
                    "type": "moduleNode",
                    "position": {
                        "x": 838.2826661503383,
                        "y": 213.9676015065532
                    },
                    "data": {
                        "id": 1.1,
                        "label": "ChordExtractor",
                        "module_inputs": {
                            "audio_in": "Audio"
                        },
                        "module_name": "ChordExtractor",
                        "module_outputs": {
                            "chords": "MIDI"
                        },
                        "module_params": {},
                        "module_type": "E1"
                    },
                    "width": 169,
                    "height": 109,
                    "positionAbsolute": {
                        "x": 838.2826661503383,
                        "y": 213.9676015065532
                    },
                },
                {
                    "id": "node_6",
                    "type": "moduleNode",
                    "position": {
                        "x": 848.490635338218,
                        "y": 352.09729564534
                    },
                    "data": {
                        "id": 1.1,
                        "label": "MelodyExtractor",
                        "module_inputs": {
                            "audio_in": "Audio"
                        },
                        "module_name": "MelodyExtractor",
                        "module_outputs": {
                            "melody": "MIDI"
                        },
                        "module_params": {},
                        "module_type": "E0"
                    },
                    "width": 178,
                    "height": 109,
                    "positionAbsolute": {
                        "x": 848.490635338218,
                        "y": 352.09729564534
                    },
                },
                {
                    "id": "node_7",
                    "type": "storeNode",
                    "position": {
                        "x": 1078.1731258941888,
                        "y": 121.83594420190889
                    },
                    "data": {
                        "id": 3.1,
                        "label": "Store",
                        "module_inputs": {
                            "data": "Any"
                        },
                        "module_name": "Store",
                        "module_outputs": {},
                        "module_params": {
                            "featureID": "bass_melody"
                        },
                        "module_type": "STORE"
                    },
                    "positionAbsolute": {
                        "x": 1078.1731258941888,
                        "y": 121.83594420190889
                    },
                    "width": 158,
                    "height": 24,
                },
                {
                    "id": "node_8",
                    "type": "storeNode",
                    "position": {
                        "x": 1020.9389218670653,
                        "y": 274.82198872442837
                    },
                    "data": {
                        "id": 3.1,
                        "label": "Store",
                        "module_inputs": {
                            "data": "Any"
                        },
                        "module_name": "Store",
                        "module_outputs": {},
                        "module_params": {
                            "featureID": "song_chords"
                        },
                        "module_type": "STORE"
                    },
                    "positionAbsolute": {
                        "x": 1020.9389218670653,
                        "y": 274.82198872442837
                    },
                    "width": 158,
                    "height": 24,
                },
                {
                    "id": "node_9",
                    "type": "storeNode",
                    "position": {
                        "x": 1056.984126914287,
                        "y": 437.26236666840595
                    },
                    "data": {
                        "id": 3.1,
                        "label": "Store",
                        "module_inputs": {
                            "data": "Any"
                        },
                        "module_name": "Store",
                        "module_outputs": {},
                        "module_params": {
                            "featureID": "vocal_melody"
                        },
                        "module_type": "STORE"
                    },
                    "positionAbsolute": {
                        "x": 1056.984126914287,
                        "y": 437.26236666840595
                    },
                    "width": 158,
                    "height": 24,
                }
            ]

edges = [
                {
                    "source": "node_1",
                    "sourceHandle": "handle-source_audio",
                    "target": "node_2",
                    "targetHandle": "handle-source_audio",
                    "id": "reactflow__edge-node_2handle-source_audio-node_3handle-source_audio"
                },
                {
                    "source": "node_2",
                    "sourceHandle": "handle-bass",
                    "target": "node_3",
                    "targetHandle": "handle-input",
                    "id": "reactflow__edge-node_3handle-bass-node_4handle-input"
                },
                {
                    "source": "node_3",
                    "sourceHandle": "handle-output",
                    "target": "node_4",
                    "targetHandle": "handle-audio_in",
                    "id": "reactflow__edge-node_4handle-output-node_6handle-audio_in"
                },
                {
                    "source": "node_2",
                    "sourceHandle": "handle-comp",
                    "target": "node_5",
                    "targetHandle": "handle-audio_in",
                    "id": "reactflow__edge-node_3handle-comp-node_7handle-audio_in"
                },
                {
                    "source": "node_2",
                    "sourceHandle": "handle-vocals",
                    "target": "node_6",
                    "targetHandle": "handle-audio_in",
                    "id": "reactflow__edge-node_3handle-vocals-node_8handle-audio_in"
                },
                {
                    "source": "node_4",
                    "sourceHandle": "handle-melody",
                    "target": "node_7",
                    "targetHandle": "handle-data",
                    "id": "reactflow__edge-node_6handle-melody-node_9handle-data"
                },
                {
                    "source": "node_5",
                    "sourceHandle": "handle-chords",
                    "target": "node_8",
                    "targetHandle": "handle-data",
                    "id": "reactflow__edge-node_7handle-chords-node_10handle-data"
                },
                {
                    "source": "node_6",
                    "sourceHandle": "handle-melody",
                    "target": "node_9",
                    "targetHandle": "handle-data",
                    "id": "reactflow__edge-node_8handle-melody-node_11handle-data"
                }
            ]

chain = ProcessingChain(nodes, edges, modules)
chain.visualise()

processor = Processor(chain, ds)
print(processor.process_layers)