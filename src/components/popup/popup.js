/*
    APPLICATION POPUPS
    __Popup is a dialog box, usually providing a form, that allows you to enter more detailed information__
*/

/* IMPORTS */
import React from 'react';
import { useState, useEffect } from 'react';

import './popup.css'; //sidebar css

// BaseWeb Imports

// Icon Imports

export default function Popup({ active, children }) {

    return active ? (
        <div id="popupContainer" className='active'>
            { children }
        </div>
    ) : null;

}