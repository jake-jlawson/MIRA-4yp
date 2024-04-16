// COMPONENT/REACT IMPORTS
import React from 'react';
import { useState } from 'react';

import './sidebar2.css';
import logo from '../../assets/MIRAlogo.png';

//ICON IMPORTS
import { RiHome2Line, 
    RiFolder3Line, 
    RiFlowChart, 
    RiMvLine, 
    RiRhythmLine, 
    RiBookOpenLine, 
    RiGithubLine, 
    RiFolderAddLine, 
    RiSettings3Line } from "react-icons/ri";

//BASEWEB IMPORTS
import { LabelXSmall } from 'baseui/typography';

import { NavLink } from 'react-router-dom';



//SIDEBAR COMPONENT
export default function Sidebar2(props) {
    
    //Make Sidebar Collapsible
    const [isCollapsed, setCollapsed] = useState(false);
    
    //Sidebar JSX
    return (
        <div id="sidebarContainer">
            
            {/*APP LOGO*/}
            <img id="appLogo" src={logo} alt='MIRA Logo'/>
            
            <div id="sidebarNav">
                {/*MAIN APP NAVIGATION*/}
                <nav id="mainNav">
                    <MainNavButton 
                        page="Home"
                        icon={<RiHome2Line className='nav-icon'/>}
                        to="/"
                    />
                    <MainNavButton
                        page="Projects"
                        icon={<RiFolder3Line className='nav-icon'/>}
                        to="/projects"
                    />
                    <MainNavButton 
                        page="Systems" 
                        icon={<RiFlowChart className='nav-icon'/>}
                        to="/systems"
                    />
                    <MainNavButton 
                        page="Datasets" 
                        icon={<RiMvLine className='nav-icon'/>}
                        to="/datasets"
                    />
                    <MainNavButton 
                        page="Tests" 
                        icon={<RiRhythmLine className='nav-icon'/>}
                    />
                </nav>

                {/*EXTERNAL LINKS NAVIGATION*/}
                <nav id="externalNav">
                    <LabelXSmall className='nav-button' id="extLinksTxt">{"External Links"}</LabelXSmall>
                    <ExternalNavButton 
                        ext="Documentation" 
                        icon={<RiBookOpenLine/>}
                    />
                    <ExternalNavButton 
                        ext="GitHub Repo" 
                        icon={<RiGithubLine/>}
                    />
                    <ExternalNavButton 
                        ext="Modules Library" 
                        icon={<RiFolderAddLine/>}
                    />
                </nav>

                {/*APP SETTINGS*/}
                <nav id="settingsNav">
                    <SettingsNavButton
                        ext="Settings"
                        icon={<RiSettings3Line/>}
                    />
                </nav>
            </div>

        </div>
    )
};


//NAV BUTTONS
function MainNavButton(props) {

    
    return(
        <NavLink to={props.to} style={{ color: 'inherit', textDecoration: 'inherit'}}>
            <div id="mainNavButton" className="nav-button">

                {props.icon}
                <h4>{props.page}</h4>

            </div>
        </NavLink>
    )
}

function ExternalNavButton(props) {
    return(
        <div id="extNavButton" className='nav-button'>
            {props.icon}
            <h5 className="btnTxt">{props.ext}</h5>
        </div>
    )
}

function SettingsNavButton(props) {
    return(
        <div id="settingsNavButton" className='nav-button'>
            {props.icon}
            <LabelXSmall className="externalLinks" id="settingsTxt">{props.ext}</LabelXSmall>
        </div>
    )
}



