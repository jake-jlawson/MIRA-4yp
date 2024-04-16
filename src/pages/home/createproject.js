/*
    CREATE PROJECT COMPONENT
    __Component for creating new projects from the home page__
*/

/* IMPORTS */
import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';

import { useProject } from '../../utils/ProjectContextProvider'; //project context

import './createproject.css'; //sidebar css

// Component Imports
import Popup from '../../components/popup/popup';

// Baseweb Imports
import { FormControl } from "baseui/form-control";
import { Input, SIZE } from "baseui/input";
import { Textarea } from "baseui/textarea";
import { Select } from "baseui/select";
import { Button } from "baseui/button";
import { DisplayXSmall } from 'baseui/typography';
import { Card, StyledBody, StyledAction } from "baseui/card";



/* "CREATE PROJECT" HOME SCREEN COMPONENT */
export default function CreateProject() {
    
    // Initial Project Details - passed as props to the project entry component
    const [projectName, setProjectName] = useState("");
    const [projectDataset, setProjectDataset] = useState("");

    const [datasetsList, setDatasetsList] = useState([]);

    // Retrieve Datasets list
    useEffect(() => {
        axios.get('http://127.0.0.1:2000/ds/get-datasets-list')
            .then(response => {
                
                //format response in the way that the "select" component uses
                const formattedDatasets = response.data.map(datasetValue => ({
                    label: datasetValue,
                    id: datasetValue
                }));
                
                setDatasetsList(formattedDatasets);
            })
            .catch(error => {
                console.log("Error retrieving datasets list!");
            })
    }, [])

    
    // State controls whether we are actively entering project details or not
    // component is passive unless this state is true
    const [projectEntryMode, setProjectEntryMode] = useState(false);

    const enterProject = () => { //logic to open Project Entry when a project creation request is made by the user
        setProjectEntryMode(true);
    }
    

    return (
        <div className='project-control'>

            {/*PROJECT ENTRY POPUP*/}
            <Popup active={projectEntryMode /*render when in project entry mode*/}> 
                <ProjectEntry
                    onClose={() => setProjectEntryMode(false)}
                    projectName={projectName}
                    projectDataset={projectDataset}
                />
            </Popup>
            

            <DisplayXSmall className="project-control-title">Create New Project</DisplayXSmall> {/*TITLE*/}


            {/*SIMPLE PROJECT ENTRY FORM*/}
            <form id="createProject">
                <Input
                    size={SIZE.compact}
                    placeholder="New Project..."
                    overrides={{
                        Root: {
                            style: {
                                height: "100%",
                                borderRadius: "0px",
                                flexGow: "1",
                            }
                        }
                    }}

                    onChange={(e) => setProjectName(e.target.value) /*input project name*/}
                />
                <Select
                    size={SIZE.compact}
                    options={datasetsList}
                    overrides={{
                        Root: {
                            style: {
                                width: "350px",
                                height: "100%",
                            }
                        },
                        ControlContainer: {
                            style: {
                                borderRadius: "0px",
                            }
                        }
                    }}

                    value={projectDataset}
                    onChange={params => setProjectDataset(params.value) /*input project dataset*/}
                />
                <Button
                    size={SIZE.compact}
                    overrides={{
                        BaseButton: {
                            style: {
                                padding: "10px 20px",
                                borderRadius: "0px",
                            }
                        }
                    }}
                    type="button"
                    onClick={enterProject /*Pull up ProjectEntry window*/}
                >Create</Button>
            </form>

        </div>
    );
}


/* "PROJECT ENTRY" COMPONENT */
function ProjectEntry({ projectName, projectDataset, onClose }) { /*component for handling project creation detailed input and logic*/

    // project data state - to update
    const [projectData, setProjectData] = useState({
        name: projectName,
        dataset: projectDataset
    });

    const updateProjectData = (attribute, value) => { //update state with form values
        setProjectData(prevState => ({
            ...prevState,
            [attribute]: value
            })
        );
    }


    // add logic for creating a new project
    const { createProject } = useProject();


    return(
        <Card overrides={{
            Root: {
                style: {
                    width: "30%",
                    padding: "10px",
                    border: "none"
                }
            }}}
        >
            <StyledBody>

                {/*PROJECT NAME INPUT*/}
                <FormControl label={() => "Project Name:"}>
                    <Input 
                        size={SIZE.compact}
                        overrides={{
                            Root: {
                                style: {
                                    borderRadius: "0px",
                                }
                            }
                        }}

                        value={projectData.name}
                        onChange={(e) => updateProjectData("name", e.target.value)}
                    />
                </FormControl>


                {/*PROJECT INITIAL DATASET INPUT*/}
                <FormControl label={() => "Initial Dataset:"}>
                    <Select
                        size={SIZE.compact}
                        options={[ //replace with code that retrieves datasets
                            { label: "SomeDataset1", id: "#F0F8FF" },
                            { label: "SomeDataset2", id: "#FAEBD7" }
                        ]}
                        overrides={{
                            ControlContainer: {
                                style: {
                                    borderRadius: "0px",
                                }
                            },
                            Root: {
                                style: {
                                    zIndex: "5"
                                }
                            }
                        }}

                        value={projectData.dataset}
                        onChange={(e) => updateProjectData("dataset", e.target.value)}
                    />
                </FormControl>


                {/*PROJECT DESCRIPTION INPUT*/}
                <FormControl label={() => "Project Description:"}>
                    <Textarea
                        size={SIZE.compact}
                        overrides={{
                            Root: {
                                style: {
                                    borderRadius: "0px",
                                }
                            }
                        }}
                        
                        onChange={(e) => updateProjectData("description", e.target.value)}
                    />
                </FormControl>

            </StyledBody>


            <StyledAction>
                {/*PROJECT CREATION BUTTON*/}
                <Button 
                    size={SIZE.compact}
                    overrides={{
                        BaseButton: {
                          style: {
                            width: "100%",
                          }
                        }
                    }}

                    onClick={() => {
                        onClose(false);
                        createProject(projectData);
                    }}
                >
                    Create Project
                </Button>

            </StyledAction>
        </Card>
    );
}