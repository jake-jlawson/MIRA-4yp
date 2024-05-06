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
    const visChartRef = useRef();
    const visBoxRef = useRef();
    const [isRendering, setIsRendering] = useState(true);

    
    // GET INITIAL VIEWING DIMENSIONS
    const [scaleWidth, setScaleWidth] = useState();
    const [scaleHeight, setScaleHeight] = useState();

    useEffect(() => {
        let viewer = document.getElementById('viewer');
        setScaleWidth(viewer.getBoundingClientRect().width);
        setScaleHeight(viewer.getBoundingClientRect().height);
    }, [])


    // TRANSLATION OF VIEWING AREA
    const xShift = {
        
        handleMouseDown(e) {
            const element = e.target;
            let initialX = e.clientX;
            console.log(initialX)

            const handleMouseMove = (e) => {
                const dx = e.clientX - initialX;
                element.style.left = `${element.offsetLeft + dx}px`;

                initialX = e.clientX;
            }

            const handleMouseUp = (e) => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            }

            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        },
    }




    const rescaleAxis = (e) => {
    }

    const shiftAxis = (e) => {

    }




    // Render Visualisation
    useEffect(() => {
        let visBox = d3.select(visBoxRef.current)
        let visChart = d3.select(visChartRef.current)
        console.log(scaleWidth, scaleHeight)
        

        //---SETUP AXES
        let xScale = d3.scaleLinear().domain([0, 60]).range([0, scaleWidth]);
        let yScale = d3.scaleLinear().domain([-1, 1]).range([scaleHeight, 0]);

        // y axis
        let axisLeft = d3.axisLeft(yScale);
        visBox.append('g')
            .attr('id', 'yAxis')
            .attr('overflow', 'visible')
            .call(axisLeft);

        // x axis
        // let axisBottom = d3.axisTop(xScale);
        // visChart.append('g')
        //     .attr('id', 'xAxis')
        //     .attr('transform', `translate(0, ${scaleHeight})`)
        //     .call(axisBottom);


        //---SET FINISHED RENDERING
        setIsRendering(false)

    }, [scaleWidth, scaleHeight])
    
    
    
    return (
        <div id='viewer'>

            {isRendering ? <div>Visualisation loading...</div> 
                : 
                <svg id="viewingBox" ref={visBoxRef}>
                    <svg id="viewingChart" 
                        ref={visChartRef}
                        width={scaleWidth}
                        height={scaleHeight}
                        draggable={true}
                        onMouseDown={(e) => xShift.handleMouseDown(e)}
                        viewBox="0 0 100 100">
                    </svg>
                </svg>
            }

        </div>
    )
    
}