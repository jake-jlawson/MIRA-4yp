/*  MODULES LIBRARY
    __Provides interface for retrieving and viewing available modules__*/
import React from 'react';
import { useState, useEffect } from 'react';

import './ModulesLibrary.css'; //projects page css

// NPM MODULE IMPORTS
import axios from 'axios';


import { useProcessor } from '../../../utils/ProcessingContextProvider'; //project context


// DESIGN IMPORTS
import { ParagraphXSmall, SIZE } from 'baseui/typography';
import { TreeView, TreeNodeData, toggleIsExpanded, TreeLabel } from 'baseui/tree-view';
import { Plus as PlusIcon, CheckIndeterminate as CheckIndeterminateIcon } from 'baseui/icon';
import { RiArrowDownSFill, RiLoopRightFill } from "react-icons/ri";



// Function for updating modules in the UI
const updateModules = (state_data, modules_data) => {

    let init_state = [...state_data]

    init_state.forEach(element => {
        let module_type = element.label.split(' ').join('');

        element.children = modules_data[module_type]
    });

    return init_state
}


// MODULES LIBRARY COMPONENT
export default function ModulesLibrary() {
    
    // Toggle open/close of the module library
    const [open, setOpen] = useState(true);
    const toggleOpen = () => {
            setOpen(!open);
    }

    
    // Load modules into application and update the UI with the modules found
    const { setGlobalModules } = useProcessor();
    
    const [modules, setModules] = useState([
        {
            id: 1,
            label: 'Utility Modules',
            isExpanded: false,
            children: []
        },
        {
            id: 2,
            label: 'Default Modules',
            isExpanded: false,
            children: []
        },
        {
            id: 3,
            label: 'User Modules',
            isExpanded: false,
            children: []
        }
    ]);

    const [reload, setReload] = useState(false); // Allow for module reloading

    useEffect(() => {
        axios.get('http://127.0.0.1:2000/processing/get-modules')
            .then(function (response) {
                setModules(updateModules(modules, response.data)); //udpate modules after recieving them
                setGlobalModules(response.data); //update modules globally
            })
            .catch(error => {
                console.log("Error retrieving modules list!");
            })
    }, [reload])

    const requestReload = () => {
        setReload(!reload)
    }


    // Handle dragging of processing modules into the main workspace
    const handleDragStart = (e) => {
        
        if (e.target.getAttribute("data-nodeid").includes('.')) { //only run on module tree items
            
            // Get module name
            let label_div = e.target.querySelector('div');
            var textContent = label_div.innerText.trim();

            // Transfer the data
            e.dataTransfer.setData('text/plain', textContent);
            e.stopPropagation();

        } else {
            return
        }
    }


    return (
        <div id="modulesLibraryContainer">

            {/*LIBRARY TAB*/}
            <div id="modulesLibraryTab">

                <ParagraphXSmall>PROCESSING MODULES</ParagraphXSmall>

                <div id="modulesTabIcon">
                    <RiLoopRightFill 
                        id="reloadIcon"
                        size={12}
                        onClick={requestReload}
                    />
                    <RiArrowDownSFill onClick={toggleOpen}/>
                </div>
                
            </div>


            {/*LIBRARY DISPLAY*/}
            <div 
                id="modulesDisplay" 
                className={open ? 'modules-display-open': 'modules-display-closed'}
                onDragStart={handleDragStart}
            >
                <TreeView
                    className='modules-tree'
                    
                    data={modules}

                    onToggle={(node) =>
                        setModules((prevData) => toggleIsExpanded(prevData, node))
                    }         

                    overrides={{
                        IconContainer: {
                            style: {
                              borderLeftStyle: 'solid',
                              borderRightStyle: 'solid',
                              borderTopStyle: 'solid',
                              borderBottomStyle: 'solid',
                              borderLeftWidth: '1px',
                              borderRightWidth: '1px',
                              borderTopWidth: '1px',
                              borderBottomWidth: '1px',
                              width: '10px',
                              height: '10px',
                            },
                        },
                        CollapseIcon: {
                            component: CheckIndeterminateIcon,
                        },
                        ExpandIcon: {
                            component: PlusIcon,
                        },
                        TreeLabel: {
                            style: {
                                fontSize: '12px'
                            }, 
                        },
                        TreeItem: {
                            props: {
                                "onDragStart": handleDragStart,
                                "draggable": true
                            }
                        }

                    }}
                />
            </div>
        </div>
    );
}
