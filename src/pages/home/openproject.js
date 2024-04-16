/*
    OPEN PROJECT COMPONENT
    __Component for opening new projects from the home page__
*/

/* IMPORTS */
import React from 'react';
import { useState, useEffect } from 'react';

import { useProject } from '../../utils/ProjectContextProvider'; //project context

import './openproject.css'; //open project components css

// BaseWeb Imports
import { DisplayXSmall } from 'baseui/typography';
import { Table } from "baseui/table-semantic";


/* "OPEN PROJECT" COMPONENT */
export default function OpenProject() {
    
    const [projectsList, setProjectsList] = useState();
    const { getProjects, openProject } = useProject();
    
    //automatically retrieve project list on render
    useEffect(() => {
        getProjects((data) => {
            setProjectsList(data);
        })
    }, [])


    //add logic for opening a particular project
    const handleProjectSelect = (e) => {
        const rowIndex = e.target.parentNode.rowIndex;
        const projectPath = projectsList[rowIndex-1][1]; // this is the path of the chosen project

        openProject(projectPath);
    }


    return (
        <div className='project-control'>
            <DisplayXSmall className="project-control-title">Open New Project</DisplayXSmall>
            
            <div id="openProject">
                <Table
                    columns={["Project Name", "File Location", "Last Opened"]}
                    data={projectsList}
                    className="open-projects-table"

                    overrides={{
                        Table: {
                            style: {
                                borderCollapse: "collapse",
                                borderSpacing: "0px"
                            }
                        },
                        TableBodyCell: {
                            style: {
                                    padding: "5px 0px",
                                    cursor: "pointer",
                                    fontSize: "11px",
                                    textAlign: "left"
                                }
                        },
                        TableHeadCell: {
                            style: {
                              display: "none"
                            }
                        }
                    }}

                    onClick={handleProjectSelect}
                />
            </div>
        </div>
    );
}
