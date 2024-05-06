/*
    APPLICATION PROJECTS PAGE
    __Provides interface for managing a full project__
*/

/* IMPORTS */
import React, { useEffect } from 'react';
import { useState, useRef } from 'react';
import { useProject } from '../../utils/ProjectContextProvider';
import axios from 'axios';

import { ProcessorProvider } from '../../utils/ProcessingContextProvider';

import './projects.css'; //projects page css

// BaseWeb Imports
import { HeadingMedium } from 'baseui/typography';
import { Tabs, Tab } from "baseui/tabs";

// Component Imports
import Datasets from '../datasets/datasets';
import SystemsWorkspace from '../systems/systems'
import ViewsWorkspace from '../views/views'


/* PROJECT PAGE COMPONENT */
export default function Projects(props) {
    
    return (
        <div id="projectsContainer">
            <ProjectsWindow/>
        </div>
    )
};


/* MAIN PROJECTS WINDOW - opens if a project ~is~ currently open */
function ProjectsWindow() {
   
    const { project, projectIsOpen, openProject, saveProject, closeProject } = useProject();

    const [activeKey, setActiveKey] = React.useState("0");


    return (
        <>
            <div id="projectsInfo">
                <div><ProjectsTitle/></div>
                <div><ProjectsDesc text={project.metadata.description}/></div>
            </div>

            <div id="projectsArea">
                <Tabs
                    onChange={({ activeKey }) => {
                        setActiveKey(activeKey);
                    }}
                    activeKey={activeKey}
                    overrides={{
                        TabContent: {
                            style: {
                                padding: "0px",
                                height: "100%",
                                textWrap: "wrap"
                            }
                        },
                        Root: {
                            style: {
                                height: "100%"
                            }
                        }
                    }}
                >
                    <Tab title="Workspace">
                        {JSON.stringify(project)}
                    </Tab>

                    <Tab title="System">
                        <SystemsWorkspace/>
                    </Tab>

                    <Tab title="Dataset">
                        <Datasets/>
                    </Tab>

                    <Tab title="Views">
                        <ViewsWorkspace/>
                    </Tab>

                    <Tab title="Tests">
                        This is where you can run tests on the whole dataset
                    </Tab>

                </Tabs>
            </div>
        </>
    );
}


/* PROJECTS COMPONENTS */
function ProjectsTitle() { /*Title Editor Component*/

    // Project title states
    const { project, updateProject, saveProject } = useProject();

    const titleRef = useRef(null); //ref to attach to the project title


    const changeTitle = (e) => {
        if (e.key === 'Enter') { // Change project title on enter
            e.preventDefault(); //prevents new line creation

            updateProject(project, { name: e.target.innerText }); // Update the project attribute with the event value
            saveProject();

            titleRef.current.blur(); // Unfocus editable component
        }
    }

    return (
        <HeadingMedium 
            className="projectTxt"
            id="projectTitle"
            contentEditable={true}
            ref={titleRef}
            onKeyDown={changeTitle}
        >
            {project.metadata.name}
        </HeadingMedium>
    )
}


function ProjectsDesc() { /*Description Editor Component*/
    
    const { project, updateProject, saveProject } = useProject();

    const descRef = useRef(null); //ref to attach to the project title


    const changeDescription = (e) => {
        if (e.key === 'Enter') { // Change project title on enter
            e.preventDefault(); //prevents new line creation

            updateProject(project, { description: e.target.innerText }); // Update the project attribute with the event value
            saveProject();

            descRef.current.blur(); // Unfocus editable component
        }
    }

    return (
        <h6 
            className="projectTxt"
            id="projectDesc"
            contentEditable={true}
            ref={descRef}
            onKeyDown={changeDescription}
        >
            {project.metadata.description}
        </h6>
    )
}


/* PROJECTS SELECTION WINDOW - opens if no project is currently open in the app */
function ProjectSelection() {
    return (
        <></>
    );
}