/*
    MAIN REACT APP FILE
    __File defines and manages the primary react app served up by electron__
*/

/* IMPORTS */
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route } from 'react-router-dom'; //react router import
import { useEffect } from 'react';
import axios from 'axios';

// Context Import
import { ProjectProvider } from './utils/ProjectContextProvider';
import { ProcessorProvider } from './utils/ProcessingContextProvider';

// Component Imports
import Sidebar from './components/sidebar/sidebar';
import Window from './components/window/window';

// Page Imports
import Home from './pages/home/home';
import Datasets from './pages/datasets/datasets';
import Projects from './pages/projects/projects';
import Systems from './pages/systems/systems';
import Tests from './pages/systemTests/systemTests';



/* DEFINE APPLICATION ROOT */
const container = document.createElement('div'); //define route inside container
container.setAttribute("id", "AppContainer");
document.body.appendChild(container);

const root = createRoot(container);


/* SETUP BASEWEB */
import { Client as Styletron } from "styletron-engine-monolithic";
import { Provider as StyletronProvider } from "styletron-react";
import { LightTheme, BaseProvider, styled } from "baseui";
const engine = new Styletron();



/* APPLICATION COMPONENT */
export default function App() {

    return (
        <StyletronProvider value={engine}>
            <BaseProvider theme={LightTheme}>
                <ProjectProvider>
                    <ProcessorProvider>
                        <div id='App'>
                                <HashRouter>
                                    
                                    {/* Application Sidebar */}
                                    <Sidebar/>

                                    {/* Application Window (controlled via routing) */}
                                    <Routes>
                                        <Route path="/" element={
                                            <Window page={<Home/>}/>
                                        }/>

                                        <Route path="/projects" element={
                                            <Window page={<Projects/>}/>
                                        }/>

                                        <Route path="/systems" element={
                                            <Window page={<Systems/>}/>
                                        }/>

                                        <Route path="/datasets" element={
                                            <Window page={<Datasets/>}/>
                                        }/>

                                        <Route path="/tests" element={
                                            <Window page={<Tests/>}/>
                                        }/>
                                    </Routes>
                    
                                </HashRouter> 
                        </div>
                    </ProcessorProvider>
                </ProjectProvider>
            </BaseProvider>
        </StyletronProvider>
    )
}

root.render(<App/>); //render app in root
    
                