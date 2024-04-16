/*
    PROJECT CONTEXT FILE
    __Allows the use of useProject() to get data about the current project, and defines a global project context for open projects__
*/

/* IMPORTS */
import React from "react";
import { useState, createContext, useContext } from "react";
import axios from 'axios';

import { getDateTime } from "./DateTime";

/* IPC Renderer */
const { ipcRenderer } = window.require('electron');

/* Project Context */
const ProjectContext = createContext({});



/* PROJECT CUSTOM HOOK */
export function useProject() {
    return useContext(ProjectContext);
}


/* PROJECT CONTEXT PROVIDER - hook available anywhere in app for changing project details*/
export function ProjectProvider({ children }) {
    
    const [projectIsOpen, setProjectOpen] = useState(false);

    // Project information / state (Javascript Object)
    const [project, setProject] = useState({
        path : "",
        metadata: {
            name: "",
            description: "",
            dateCreated: "",
            dateLastOpened: ""
        },
        data: {
            system: [],
            dataset: [],
            views: [],
            tests: []
        }
    }); 

    
    // Update project attributes with new project data string
    const updateProject = (current_project, new_data) => {
    
        console.log("Updating Project!");

        for (let key in current_project) {
            
            if (typeof current_project[key] === 'object' && !Array.isArray(current_project[key])) {
                updateProject(current_project[key], new_data);
    
            } else if (new_data.hasOwnProperty(key)){
                current_project[key] = new_data[key];
    
            } else {
                continue;
            }  
        }
        return current_project;
    }


    // Global method for creating a project
    const createProject = (new_project_data) => {
        
        // Add dateCreated to project update data
        new_project_data["dateCreated"] = getDateTime();
        new_project_data["dateLastOpened"] = getDateTime();

        // Update Project State
        setProject(prevProject => {

            let project_to_update = {...prevProject} // copy project

            let newProject = updateProject(project_to_update, new_project_data); // update project
            setProjectOpen(true);

            console.log(project.data.dataset[0].id)

            // open the required dataset in the backend
            axios.post('http://127.0.0.1:2000/ds/open-dataset', {
                name: project.data.dataset[0].id
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })

            return newProject;
        });

        ipcRenderer.send('createProject', project); // tell electron to create a new project file
    }


    // Global method for opening a project
    const openProject = (project_file_path) => {
        
        ipcRenderer.send('openProject', project_file_path); // request project be opened in the main process

        ipcRenderer.on('projectOpened', (event, project_data) => { // retrieve data associated with project

            project_data = JSON.parse(project_data);
            let project_dataset = project_data.data.dataset[0].id;

            // open dataset in backend
            axios.post('http://127.0.0.1:2000/ds/open-dataset', {
                name: project_dataset
            })
                .then(function (response) {
                    console.log(response);
                })
                .catch(function (error) {
                    console.log(error);
                })
            
            // set the current project state to the data recieved from the IPCmain
            setProject(project_data);

            // set project open
            setProjectOpen(true);
        });
    }
    

    // Global method for saving a project
    const saveProject = () => {
        
        ipcRenderer.send('saveProject', project);
    }


    // Global method for closing a project
    const closeProject = () => {
        
        // Clear Project Data
        setProject({
            path : "",
            metadata: {
                name: "",
                description: "",
                dateCreated: "",
                dateLastOpened: ""
            },
            data: {
                system: [],
                dataset: [],
                views: [],
                tests: []
            }
        });
        
        // Set project to closed
        setProjectOpen(false);

        // Close dataset in backend
        axios.get('http://127.0.0.1:2000/ds/close-dataset')
            .then(response => {
                console.log(response);
            })
    }


    // Global method for finding available projects
    const getProjects = (callback) => {
        ipcRenderer.send('retrieveProjects');

        ipcRenderer.on('projectsList', (event, data) => {
            callback(data);
        })
    }
    

    
    const projectContextValue = { //expose interface
        projectIsOpen,
        project, 
        openProject, 
        createProject, 
        saveProject, 
        closeProject,
        updateProject,
        getProjects
    } 
    
    return (
        <ProjectContext.Provider value={projectContextValue}>
            { children }
        </ProjectContext.Provider>
    )
}