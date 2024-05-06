/*
    VIEWS PANEL
    __Provides interface for viewing visualisations__
*/

/* IMPORTS */
import React from 'react';

import './views.css'; //views css
import { useProject } from '../../utils/ProjectContextProvider';

/* IMPORT VISUALISATIONS*/
import TimeVis from '../../vis-system/time-vis/TimeVis';
import ViewPanel from './viewpanel';


export default function ViewsWorkspace() {
    return (
        <div id='viewsWorkspace'>
            <ViewPanel />
        </div>
    )
}