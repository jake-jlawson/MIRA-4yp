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


// REACTFLOW NODE IMPORTS
import ModuleNode from './systems-builder-components/ModuleNodes'
import { useProcessor } from '../../utils/ProcessingContextProvider';




const initialNodes = []

const nodeTypes = { moduleNode: ModuleNode };
const proOptions = { hideAttribution: true };

let id = 0;
const getId = () => `node_${id++}`;


// SIDEBAR COMPONENT
export default function SystemsWorkspace(props) {

    const reactFlowWrapper = useRef(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
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


    // Allow Modules Library to add nodes
    const { processingModules } = useProcessor();

    const handleDrop = useCallback((event) => {
        
        // data required to instantiate module
        const module_name = event.dataTransfer.getData('text/plain');

        if (module_name != "") {
            const cursorPosition = reactFlowInstance.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY
            });
            

            console.log(module_name);
            console.log(cursorPosition);

            let new_node = { id: getId(), type: 'moduleNode', position: cursorPosition, data: processingModules[module_name] }
            console.log(new_node);

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
            
            </div>
        </ReactFlowProvider>
    )
};
