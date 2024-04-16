/*
    PROCESSING CONTEXT FILE
    __Allows the use of useProcessor() to get available processing modules and carry out processing related activities__
*/

/* IMPORTS */
import React from "react";
import { useState, createContext, useContext } from "react";

/* Processing Context */
const ProcessorContext = createContext({});


/* PROJECT CUSTOM HOOK */
export function useProcessor() {
    return useContext(ProcessorContext);
}


export function ProcessorProvider({ children }) {

    const [processingModules, setProcessingModules] = useState(false);


    const setGlobalModules = (modules_object) => {

        const allChildren = [].concat(...Object.values(modules_object)); //get one single modules list

        let modules_list = {};

        allChildren.forEach(element => { //list in terms of key-value pairs
            modules_list[element.label] = element
        });

        console.log(modules_list)

        setProcessingModules(modules_list) //get global modules
    }



    const processorContextValue = { //expose interface
        processingModules,
        setGlobalModules
    } 
    
    return (
        <ProcessorContext.Provider value={processorContextValue}>
            { children }
        </ProcessorContext.Provider>
    )
}