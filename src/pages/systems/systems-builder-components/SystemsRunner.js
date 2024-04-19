/*  SYSTEMS RUNNER
    __Provides interface for controlling the execution of processing chains__*/

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socketIOClient from 'socket.io-client';
import { useProcessor } from '../../../utils/ProcessingContextProvider'; //project context

import './SystemsRunner.css'; //projects page css

//Baseweb imports
import { SIZE } from "baseui/input";
import { Button } from "baseui/button";
import { ProgressBar } from "baseui/progress-bar";


/*SYSTEMS RUNNER COMPONENT*/
export default function SystemsRunner() {
    
    const [systemRunning, setSystemRunning] = useState(false);
    const [progress, setProgress] = useState(0);
    const [progressTxt, setProgressTxt] = useState("");

    const { chainNodes, chainEdges } = useProcessor();
    

    useEffect(() => {
        const socket = socketIOClient('http://127.0.0.1:2000');

        socket.on('progress_update', (data) => {
            let progress = data.progress
            let progress_text = data.update_txt

            setProgress(prevProgress => prevProgress + progress)
            setProgressTxt(progress_text)
        })

        socket.on('process-complete', (data) => {
            setProgress(data.progress)
            setProgressTxt(data.update_txt)

            setTimeout(() => {
                setSystemRunning(false)
                return () => socket.disconnect()
            }, 2000)  
        })
    }, [])


    const runSystem = () => {
        
        if (systemRunning == false) {
            setSystemRunning(true)
            axios.post('http://127.0.0.1:2000/processing/run-system', {nodes: chainNodes, edges: chainEdges})
        } else {
            return
        }
        
    }
    

    return (
        <div id="systemsRunnerContainer">
            
            {systemRunning ? 
            
            <div id="progressUI">
                <p id="statusUpdate" className='status-signal'>{progressTxt}</p>
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
                    
                    }}
                    maxValue={10}
                />
            </div> : <></>}
            

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


