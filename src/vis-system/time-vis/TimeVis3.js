/*---TIME BASED VISUALISATION---*/
/*This visualisation visualises features that are time varying
These feature visualisations keep the timescale of the original song*/

import React, { useState, useEffect, useRef } from 'react';
import * as d3 from "d3";
import './TimeVis.css';


/* 
    TIME-BASED VISUALISATION COMPONENT
*/
export default function TimeVis() {
    return (
        <div id='timeVisContainer'>
            <div id='timeVisControls'></div>

            <ViewingArea />
        </div>
    )
}


/* 
    VISUALISATION VIEWING AREA
*/
function ViewingArea() {
    const viewRef = useRef();
    const plotRef = useRef();
    const [isRendering, setIsRendering] = useState(true);

    
    // GET INITIAL VIEWING DIMENSIONS
    const [scaleWidth, setScaleWidth] = useState();
    const [scaleHeight, setScaleHeight] = useState();

    useEffect(() => {
        let viewer = document.getElementById('viewerContainer');
        setScaleWidth(viewer.getBoundingClientRect().width);
        setScaleHeight(viewer.getBoundingClientRect().height);
    }, [])


    // TRANSLATION OF VIEWING AREA
    const xShift = {
        
        handleMouseDown(e) {
            const element = e.target;
            let initialX = e.clientX;


            const handleMouseMove = (e) => {
                const dx = e.clientX - initialX;
                d3.select(element).attr('transform', `translate(0, 0)`);
                
                const currentTransform = d3.select(element).attr('transform');
                console.log(currentTransform)
                const currentTranslateX = parseFloat(currentTransform.split('(')[1].split(',')[0]);
                const newTranslateX = currentTranslateX + dx;
                
                
                d3.select(element)
                    .attr('transform', `translate(${newTranslateX}, 0)`);

                initialX = e.clientX;
            }

            const handleMouseUp = (e) => {
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            }

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
    }




    // const rescaleAxis = (e) => {
    // }

    // const shiftAxis = (e) => {

    // }




    // Render Visualisation
    useEffect(() => {
        let visView = d3.select(viewRef.current)
        let visPlot = d3.select(plotRef.current)
        

        //---SETUP AXES
        let xScale = d3.scaleLinear().domain([0, 60]).range([0, scaleWidth]);
        let yScale = d3.scaleLinear().domain([-1, 1]).range([scaleHeight, 0]);

        // y axis
        let axisLeft = d3.axisLeft(yScale);
        visView.append('svg')
            .attr('id', 'yAxis')
            .attr('overflow', 'visible')
            .attr('transform', `translate(0, ${-scaleHeight})`)
            .call(axisLeft);

        // x axis
        let axisBottom = d3.axisTop(xScale);
        visPlot.append('g')
            .attr('id', 'xAxis')
            .attr('transform', `translate(0, ${scaleHeight})`)
            .call(axisBottom);


        //---SET FINISHED RENDERING
        setIsRendering(false)

    }, [scaleWidth, scaleHeight])
    
    
    
    return <div id="viewerContainer">
        
        {isRendering ? <div>Visualisation loading...</div> 
            : 
            <div id='viewer' ref={viewRef}> {/*Includes y-axis*/}
                <div id='viewport'> {/*Hides parts of the plot that are not necessary*/}
                    <svg 
                        id='visPlot' 
                        ref={plotRef}
                        viewBox={`0 0 ${scaleWidth} ${scaleHeight}`}
                        draggable={true}
                        onMouseDown={(e) => xShift.handleMouseDown(e)}>
                    </svg>
                </div>
            </div>
            }
        
        </div>
        
    
}