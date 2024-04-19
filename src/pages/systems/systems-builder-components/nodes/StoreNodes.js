/*
    CUSTOM NODES DEFINTIION
    __ReactFlow implementation for custom nodes to represent processing modules__
*/
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals, useNodeId, useReactFlow } from 'reactflow';

import './StoreNodes.css'; //projects page css
import { useProcessor } from '../../../../utils/ProcessingContextProvider';
import { RiUserSearchFill } from 'react-icons/ri';



/* NODE COMPONENT - Component defines a processing module as a node*/
export default function StoreNode({ data }) {
    
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);
    
    // Node properties
    let inputs = data.module_inputs;
    let inputType = inputs.data;
    let type = data.module_type;
    let node_id = useNodeId();


    //Dynamically change colour depending on module type
    const rootStyle = {
        '--color': "#1B1B1B"
    }

    //Handle input of featureID
    const [featureID, setFeatureID] = useState(data.module_params["featureID"]);
    const { setNodes } = useReactFlow();
    const { chainNodes } = useProcessor();
    
    useEffect(() => {
        if (chainNodes === undefined) {
            console.log("Nodes are undefined!")
            return
        }

        setNodes((nds) => nds.map((node) => {
            
            if (node.id === node_id) {
                return{
                    ...node,
                    data: {
                        ...node.data,
                        module_params: {featureID: featureID}
                    }
                }    
            } else {
                return node;
            }
        }))
    }, [featureID])

    const changeFeatureID = (e) => {
        setFeatureID(e.target.value);
    }


    return (
        <>
            {/*INSTANTIATE HANDLES DYNAMICALLY*/}
            {Object.entries(inputs).map(([key, value], index) => (
                <Handle 
                    key={key} 
                    type="target" 
                    id={`handle-${key}`}
                    position={Position.Left}
                    isConnectable={1}
                />
            ))}
        
            <div id="storeContainer" style={rootStyle}>
                <ModuleType module_type={type}/>

                <ModuleInput data_type={inputType} parentState={featureID} setParentState={changeFeatureID}/>
            </div>  
        </>
    )
}

/* MODULEIOS- Renders single module ios */
function ModuleInput(props) {
    return (
        <div id="storeDataInput">
            <IOtype io_type={props.data_type}/> {/*input type*/}

            <input 
                type="text"
                id="storeVarInput"
                placeholder='featureID'
                draggable={false}
                onChange={props.setParentState}
                value={props.parentState}
            />

        </div>
    );
}


/* TYPE INDICATORS - Renders type indicators (input/output type and module type) */
function IOtype(props) {
    return (
        <div className='store-in-type'>
            {(props.io_type).toUpperCase()}
        </div>
    )
}

function ModuleType(props) {
    return (
        <div id="storeTag">
            {props.module_type}
        </div>
    )
}