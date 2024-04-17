// COMPONENT/REACT IMPORTS
import React from 'react';

import './locationbar.css';

import { ChevronLeft } from "baseui/icon";
import { Breadcrumbs } from "baseui/breadcrumbs";
import { StyledLink } from "baseui/link";

import { useProject } from '../../utils/ProjectContextProvider';
import { useProcessor } from '../../utils/ProcessingContextProvider';


export default function LocationBar(props) {

    //Window JSX
    return (
        <div id='locationContainer'>
            <BackButton/>
            
            <Breadcrumbs
                overrides={{
                    ListItem: {
                        style: ({ $theme }) => ({
                            fontSize: "12px"
                        })
                    }
                }}
            >
            
                <StyledLink href="#parent">Projects</StyledLink>
                <span>New Project</span>

            </Breadcrumbs>

        </div>
    )
}


function BackButton() {
    
    const { project, closeProject, saveProject } = useProject();
    const { clearProcessingChain } = useProcessor();

    const clearProject = () => {
        saveProject();
        closeProject();
        clearProcessingChain();
    }
    
    return (
        <div id="backButton" onClick={clearProject}>
            <ChevronLeft size={25}/>
        </div>
    )
}