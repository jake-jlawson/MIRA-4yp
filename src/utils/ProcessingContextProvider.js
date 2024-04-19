/*
    PROCESSING CONTEXT FILE
    __Allows the use of useProcessor() to get available processing modules and carry out processing related activities__
*/

/* IMPORTS */
import React from "react";
import { useState, createContext, useContext, useEffect } from "react";

import { useProject } from './ProjectContextProvider';

/* Processing Context */
const ProcessorContext = createContext({});


/* PROJECT CUSTOM HOOK */
export function useProcessor() {
    return useContext(ProcessorContext);
}


export function ProcessorProvider({ children }) {

    const { project } = useProject();
    
    const [processingModules, setProcessingModules] = useState(false);
    const [chainNodes, updateChainNodes] = useState([]);
    const [chainEdges, updateChainEdges] = useState([]);


    useEffect(() => {
        updateChainNodes(project.data.system.nodes);
        updateChainEdges(project.data.system.edges);
    }, [project])



    const setGlobalModules = (modules_object) => {

        const allChildren = [].concat(...Object.values(modules_object)); //get one single modules list

        let modules_list = {};

        allChildren.forEach(element => { //list in terms of key-value pairs
            modules_list[element.label] = element
        });

        setProcessingModules(modules_list) //get global modules
    }

    //Function calls an update of the global processing chain
    const updateProcessingChain = (nodes, edges) => {
        updateChainNodes(nodes);
        updateChainEdges(edges);
    }

    const clearProcessingChain = () => {
        updateChainNodes([]);
        updateChainEdges([]);
    }




    const processorContextValue = { //expose interface
        processingModules,
        setGlobalModules,
        updateProcessingChain,
        clearProcessingChain,
        chainNodes,
        chainEdges,
        updateChainNodes
    } 
    
    return (
        <ProcessorContext.Provider value={processorContextValue}>
            { children }
        </ProcessorContext.Provider>
    )
}