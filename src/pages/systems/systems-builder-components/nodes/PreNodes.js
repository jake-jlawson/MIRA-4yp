/*
    CUSTOM NODES DEFINTIION
    __ReactFlow implementation for custom nodes to represent processing modules__
*/
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import './PreNodes.css'; //projects page css



/* NODE COMPONENT - Component defines a processing module as a node*/
export default function PreNode({ data }) {
    
    const onChange = useCallback((evt) => {
        console.log(evt.target.value);
      }, []);

    
    // Node properties
    let name = data.label;
    let inputs = data.module_inputs;
    let outputs = data.module_outputs;
    let type = data.module_type;


    //Dynamically change colour depending on module type
    const rootStyle = {
        '--color': "#FFE438"
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
                    style={{top: "33px"}}
                    isConnectable={1}
                />
            ))}

            {Object.entries(outputs).map(([key, value], index) => (
                <Handle 
                    key={key} 
                    type="source" 
                    id={`handle-${key}`}
                    position={Position.Right}
                    style={{top: "33px"}}
                />
            ))}
        
        
        
            <div id="moduleContainer" style={rootStyle}>
                
                {/*MODULE HEADER*/}
                <div id="preHeader">
                    <p>{name}</p>
                    <ModuleType module_type={type}/>
                </div>

                {/*MODULE INPUTS*/}
                <div id="moduleIO" className='pre-input-output'>
                    <MultiIO data={inputs} io="input"/>
                    <MultiIO data={outputs} io="output"/>
                </div>

                {/*MODULE PARAMETERS*/}
                <div id="moduleParameters"></div>
            </div>  
        </>
    )
}


/* MULTIIO - Renders the inputs and outputs of the module */
function MultiIO(props) {
    
    if (props.io == "input") {
        return (
            <div>
              {Object.entries(props.data).map(([key, value]) => (
                <ModuleInput key={key} data_var={key} data_type={value} />
              ))}
            </div>
        );

    } 
    
    else if (props.io == "output") {
        return (
            <div>
              {Object.entries(props.data).map(([key, value]) => (
                <ModuleOutput key={key} data_var={key} data_type={value} />
              ))}
            </div>
        );
    }
}

/* MODULEIOS- Renders single module ios */
function ModuleInput(props) {
    return (
        <div id="moduleInput">
            <IOtype io_type={props.data_type}/> {/*input type*/}
        </div>
    );
}

function ModuleOutput(props) {
    return (
        <div id="moduleOutput">
            <IOtype io_type={props.data_type}/> {/*output type*/}
        </div>
    );
}


/* TYPE INDICATORS - Renders type indicators (input/output type and module type) */
function IOtype(props) {
    return (
        <div className='pre-io-type'>
            {(props.io_type).toUpperCase()}
        </div>
    )
}

function ModuleType(props) {
    return (
        <div id="preTag">
            {props.module_type}
        </div>
    )
}