/*
    APPLICATION SIDEBAR
    __Sidebar is a persistent component which provides navigation for the application__
*/

/* IMPORTS */
import React from 'react';
import { useState } from 'react';

import { NavLink } from 'react-router-dom';

import './sidebar.css'; //sidebar css
import logo from '../../assets/MIRAlogo.png'; //app logo
import tabLeft from '../../assets/TabLeft.png'; //open/close tab
import tabRight from '../../assets/TabRight.png';

// Icon Imports
import { RiHome2Line, 
    RiFolder3Line, 
    RiFlowChart, 
    RiMvLine, 
    RiRhythmLine, 
    RiBookOpenLine, 
    RiGithubLine, 
    RiFolderAddLine, 
    RiSettings3Line } from "react-icons/ri";

// BaseWeb Imports
import { LabelSmall } from 'baseui/typography';


/* SIDEBAR COMPONENT */
export default function Sidebar(props) {
    
    // Make Sidebar Collapsible
    const [isCollapsed, setCollapsed] = useState(false);

    const toggleSidebar = () => { //handle toggling of sidebar
        setCollapsed(!isCollapsed);
    };

    const sidebarClass = isCollapsed ? "sidebar-closed" : "sidebar-open"; //set class depending on if sidebar is collapsed
    

    // Sidebar JSX
    return (
        <div id="sidebarContainer" className={sidebarClass}>
            {/*Sidebar Toggle Button*/}
            <img id="toggleBtn" src={isCollapsed ? tabRight : tabLeft} onClick={toggleSidebar}/>
            
            <div id="logoContainer">
                {/*App Logo*/}
                <img id="appLogo" src={logo} alt='MIRA Logo'/>  
            </div>
            
            <div id="navContainer">
                {/*Primary Navigation*/}
                <nav id="primaryNav">
                    <PrimaryNavButton
                        page="Home"
                        icon={<RiHome2Line size={16} className='nav-icon'/>}
                        to="/"
                    />
                    <PrimaryNavButton
                        page="Projects"
                        icon={<RiFolder3Line size={16} className='nav-icon'/>}
                        to="/projects"
                    />
                    <PrimaryNavButton
                        page="Systems"
                        icon={<RiFlowChart size={16} className='nav-icon'/>}
                        to="/systems"
                    />
                    <PrimaryNavButton
                        page="Datasets"
                        icon={<RiMvLine size={16} className='nav-icon'/>}
                        to="/datasets"
                    />
                    <PrimaryNavButton
                        page="Tests"
                        icon={<RiRhythmLine size={16} className='nav-icon'/>}
                        to="/tests"
                    />
                </nav>

                <nav id="externalNav">
                    <LabelSmall className='nav-button title-txt' id="extLinksTxt">{"External Links"}</LabelSmall>
                    <ExternalNavButton
                        txt="Documentation"
                        icon={<RiBookOpenLine className='nav-icon'/>}
                        to="/"
                    />
                    <ExternalNavButton
                        txt="GitHub Repo"
                        icon={<RiGithubLine className='nav-icon'/>}
                        to="/"
                    />
                    <ExternalNavButton
                        txt="Modules Library"
                        icon={<RiFolderAddLine className='nav-icon'/>}
                        to="/"
                    />
                </nav>

                <SettingsButton
                    ext="Settings"
                    icon={<RiSettings3Line className='nav-icon'/>}
                />
            </div>  
        </div>
    );
};


// Primary Navigation Buttons
function PrimaryNavButton(props) {
    return (
        <NavLink 
            to={props.to}
            style={{ color: 'inherit', textDecoration: 'inherit'}}
            className={({ isActive }) => (isActive ? 'active-button' : 'inactive-button')}
        >
            <div id="primaryNavButton" className="nav-button">

                {props.icon}
                <h4>{props.page}</h4>

            </div>
        </NavLink>
    );
}

// External Navigation Buttons
function ExternalNavButton(props) {
    return (
        <a href="" style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <div id="externalNavButton" className="nav-button">

                {props.icon}
                <h5>{props.txt}</h5>

            </div>
        </a>
    );
}

function SettingsButton(props) {
    return (
        <div id="settingsButton" className='nav-button'>
            {props.icon}
            <LabelSmall className="title-txt" id="settingsTxt">{props.ext}</LabelSmall>
        </div>
    );
}


