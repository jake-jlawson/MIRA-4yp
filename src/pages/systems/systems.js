// COMPONENT/REACT IMPORTS
import React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import ReactFlow, { 
    ReactFlowProvider,
    Controls, 
    Background, 
    addEdge, 
    applyEdgeChanges, 
    applyNodeChanges, 
    useNodesState,
    useEdgesState } from 'reactflow';
import axios from 'axios';

import './systems.css'; //projects page css
import 'reactflow/dist/style.css';


import ModulesLibrary from './systems-builder-components/ModulesLibrary';
import SystemsRunner from './systems-builder-components/SystemsRunner';


// REACTFLOW NODE IMPORTS
import ModuleNode from './systems-builder-components/nodes/ModuleNodes';
import PreNode from './systems-builder-components/nodes/PreNodes';
import SourceNode from './systems-builder-components/nodes/SourceNodes';
import StoreNode from './systems-builder-components/nodes/StoreNodes';

import { useProcessor } from '../../utils/ProcessingContextProvider';
import { useProject } from '../../utils/ProjectContextProvider';



const nodeTypes = { moduleNode: ModuleNode, preNode: PreNode, srcNode: SourceNode, storeNode: StoreNode };
const proOptions = { hideAttribution: true };

let id = 0;
const getId = () => `node_${id++}`;



// SYSTEMS WORKSPACE COMPONENT
export default function SystemsWorkspace(props) {

    //Import contexts
    const { processingModules, updateProcessingChain, chainNodes, chainEdges } = useProcessor();
    const { project, updateSystem } = useProject();

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(chainNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(chainEdges);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);

    // const onNodesChange = useCallback(
    //     (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    //     [setNodes]
    // );
    // const onEdgesChange = useCallback(
    //     (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    //     [setEdges]
    // );

    const onConnect = useCallback(
        (connection) => setEdges((eds) => addEdge(connection, eds)),
        [setEdges]
    );



    //update global processing chain and project processing chain
    const firstRender = useRef(true);


    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        
        updateProcessingChain(nodes, edges); //update global processing chain
        updateSystem({nodes: nodes, edges: edges});

    }, [nodes, edges])


    // useEffect(() => {
    //     setNodes(chainNodes);
    //     setEdges(chainEdges);
    // }, [project])


    // Allow Modules Library to add nodes
    const handleDrop = useCallback((event) => {
        
        // data required to instantiate module
        const module_name = event.dataTransfer.getData('text/plain');

        if (module_name != "") {
            const cursorPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });
            
            let module_data = processingModules[module_name];
            let module_type = 'moduleNode';

            if (module_data.module_type == "PRE") {
                module_type = 'preNode';
            }
            if (module_data.module_type == "SRC") {
                module_type = 'srcNode';
            }
            if (module_data.module_type == "STORE") {
                module_type = 'storeNode'
            }

            let new_node = { id: getId(), type: module_type, position: cursorPosition, data: module_data }

            setNodes((nds) => nds.concat(new_node));
        }
    
    }, [reactFlowInstance, processingModules]);


    const allowDrop = useCallback((event) => {
        event.preventDefault();
    })

    
    return (
        <ReactFlowProvider>
            <div id="systemsWorkspaceContainer" ref={reactFlowWrapper}>
            
                <ModulesLibrary/>
                
                <ReactFlow 
                    nodes={nodes} 
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    nodeTypes={nodeTypes}
                    fitView
                    proOptions={proOptions}
                    onDrop={handleDrop} onDragOver={allowDrop}
                >
                    <Controls position="top-right"/>
                    <Background id="1" gap={10} color="#f1f1f1" variant={'lines'} />
                    <Background id="2" gap={100} offset={1} color="#e9e9e9" variant={'lines'} />
                </ReactFlow>

                <SystemsRunner/>
            
            </div>
        </ReactFlowProvider>
    )
};
