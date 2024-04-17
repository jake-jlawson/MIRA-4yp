/*
    CUSTOM NODES DEFINTIION
    __ReactFlow implementation for custom nodes to represent processing modules__
*/
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import './SourceNodes.css'; //projects page css


/* NODE COMPONENT - Component defines a processing module as a node*/
export default function SourceNode({ data }) {
    
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
        '--color': "#1B1B1B"
    }

    return (
        
        <>
            {Object.entries(outputs).map(([key, value], index) => (
                <Handle 
                    key={key} 
                    type="source" 
                    id={`handle-${key}`}
                    position={Position.Right}
                    style={{top: "36px"}}
                />
            ))}

            <div id="srcContainer" style={rootStyle}>
                
                {/*MODULE HEADER*/}
                <div id="srcHeader">
                    <p>{name}</p>
                    <ModuleType module_type={type}/>
                </div>

                {/*MODULE OUTPUTS*/}
                <div id="srcOutputs" className='input-output'>
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
    return (
        <div>
            {Object.entries(props.data).map(([key, value]) => (
                <ModuleOutput key={key} data_var={key} data_type={value} />
            ))}
        </div>
        );
}


function ModuleOutput(props) {
    return (
        <div id="srcOutput">
            <p className='io-name'>{props.data_var}</p> {/*output variable*/}

            <div id="srcSpacer"></div>

            <IOtype io_type={props.data_type}/> {/*output type*/}
        </div>
    );
}


/* TYPE INDICATORS - Renders type indicators (input/output type and module type) */
function IOtype(props) {
    return (
        <div className='src-out-type'>
            {(props.io_type).toUpperCase()}
        </div>
    )
}

function ModuleType(props) {
    return (
        <div id="srcTag">
            {props.module_type}
        </div>
    )
}