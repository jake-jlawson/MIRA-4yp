/*  SYSTEMS RUNNER
    __Provides interface for controlling the execution of processing chains__*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useProcessor } from '../../../utils/ProcessingContextProvider'; //project context

import './SystemsRunner.css'; //projects page css

//Baseweb imports
import { SIZE } from "baseui/input";
import { Button } from "baseui/button";
import { ProgressBar } from "baseui/progress-bar";


/*SYSTEMS RUNNER COMPONENT*/
export default function SystemsRunner() {
    
    const [progress, setProgress] = useState(60);

    const { chainNodes, chainEdges } = useProcessor();
    

    const runSystem = () => {
       
        axios.post('http://127.0.0.1:2000/processing/run-system', {nodes: chainNodes, edges: chainEdges})
        
        console.log(chainNodes);
        console.log(chainEdges);
    }
    
    return (
        <div id="systemsRunnerContainer">
            
            <div id="progressUI">
                <p id="statusUpdate" className='status-signal'>Loading Processing Chain...</p>
                <ProgressBar 
                    value={progress}
                    className='status-signal'
                    overrides={{
                        Root: {
                            style: {
                                height: "auto",
                            }
                        },
                        BarContainer: {
                            style: {
                                marginTop: "0px",
                            }
                        }
                    }}/>
            </div>
            
            <Button
                size={SIZE.compact}
                overrides={{
                    BaseButton: {
                        style: {
                            padding: "6px 13px",
                            borderRadius: "0px",
                        }
                    }
                }}
                type="button"
                onClick={runSystem}
            >
                    Run
            </Button>
        </div> 
    )
}



