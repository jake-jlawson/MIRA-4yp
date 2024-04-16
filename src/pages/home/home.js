/*
    APPLICATION HOME PAGE
    __Provides interface for starting the program, or returns current project dashboard__
*/

/* IMPORTS */
import React from 'react';

import './home.css'; //home css
import { useProject } from '../../utils/ProjectContextProvider';

// Component Imports
import CreateProject from './createproject';
import OpenProject from './openproject';
import Projects from '../projects/projects';



/* HOME PAGE COMPONENT */
export default function Home(props) {

    const { projectIsOpen } = useProject();

    // Return projects page if project is open
    if (projectIsOpen) { 
        return (
            <Projects/>
        )
    } 
    // Return regular homepage if project is not open
    else { 
        return (
            <div id="homeContainer">
                <CreateProject/>
                <OpenProject/>
            </div>
        )
    }
};



