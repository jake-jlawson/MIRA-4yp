/*
    CUSTOM NODES DEFINTIION
    __ReactFlow implementation for custom nodes to represent processing modules__
*/
import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { Handle, Position, useUpdateNodeInternals } from 'reactflow';

import './ModuleNodes.css'; //projects page css


const module_types_colours = {
    "UTIL": "#1B1B1B",
    "E0": "#FE5050",
    "E1": "#308edb",
    "E2": "#4ddb30",
    "PRE": "#FFE438",
}


/* NODE COMPONENT - Component defines a processing module as a node*/
export default function ModuleNode({ data }) {
    
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
        '--color': module_types_colours[type]
    }

    //Handle root positioning
    const getHandlePosition = (index, io) => {
        
        if (io == "input") {
            var idx_1 = 49;
            // console.log(idx_1)
        } else if (io == "output") {
            var idx_1 = 49 + (Object.keys(inputs).length-1)*20 + 10 + 13 + 10;
            // console.log(idx_1)
        }

        let top_position = idx_1 + (index)*20
        let pos_str = top_position.toString() + "px"
        
        return {"top": pos_str}
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
                    style={getHandlePosition(index, "input")}
                    isConnectable={1}
                />
            ))}

            {Object.entries(outputs).map(([key, value], index) => (
                <Handle 
                    key={key} 
                    type="source" 
                    id={`handle-${key}`}
                    position={Position.Right}
                    style={getHandlePosition(index, "output")}
                />
            ))}
        
        
        
            <div id="moduleContainer" style={rootStyle}>
                
                {/*MODULE HEADER*/}
                <div id="moduleHeader">
                    <p>{name}</p>
                    <ModuleType module_type={type}/>
                </div>

                {/*MODULE INPUTS*/}
                <div id="moduleInputs" className='input-output'>
                    <MultiIO data={inputs} io="input"/>
                </div>

                {/*MODULE OUTPUTS*/}
                <div id="moduleOutputs" className='input-output'>
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
            
            <p className='io-name'>{props.data_var}</p> {/*input variable*/}
            
            <div id="ioSpacer"></div>
        </div>
    );
}

function ModuleOutput(props) {
    return (
        <div id="moduleOutput">
            <div id="ioSpacer"></div>

            <p className='io-name'>{props.data_var}</p> {/*output variable*/}

            <IOtype io_type={props.data_type}/> {/*output type*/}
        </div>
    );
}


/* TYPE INDICATORS - Renders type indicators (input/output type and module type) */
function IOtype(props) {
    return (
        <div className='io-type'>
            {(props.io_type).toUpperCase()}
        </div>
    )
}

function ModuleType(props) {
    return (
        <div id="moduleType">
            {props.module_type}
        </div>
    )
}






