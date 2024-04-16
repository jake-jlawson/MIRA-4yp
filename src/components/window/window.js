// COMPONENT/REACT IMPORTS
import React from 'react';

import './window.css';
import LocationBar from '../../components/locationbar/locationbar';


export default function Window(props) {

    //Window JSX
    return (
        <div id='windowContainer'>
            <LocationBar/>
            <div id="pageContainer">
                {props.page}
            </div>
        </div>
    )
}