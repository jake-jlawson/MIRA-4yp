/*---TIME BASED VISUALISATION---*/
/*This visualisation visualises features that are time varying
These feature visualisations keep the timescale of the original song*/

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import * as d3 from "d3";
import axios from 'axios';


import './TimeVis.css';

// Design Imports
import { LabelLarge } from 'baseui/typography';
import { Button, SIZE } from "baseui/button";
import { Select } from "baseui/select";
import { RiPlayFill, RiSkipForwardFill, RiSkipBackFill, RiArrowLeftSLine, RiArrowRightSLine } from "react-icons/ri";


// Time-based visualisation imports
import { Waveform } from './time-vis-methods/Waveform';
import { Waveform2 } from './time-vis-methods/Waveform2';
import { Waveform3 } from './time-vis-methods/Waveform3';
import { BarLines } from './time-vis-methods/BarLines';
import { TimeSeries } from './time-vis-methods/TimeSeries';


/* 
    TIME-BASED VISUALISATION COMPONENT
*/
export default function TimeVis() {
    
    return (
        <div id="timeVisContainer">
            <VisControls />

            <div id="viewer">
                <ViewingArea />
            </div>
            
        </div>
    )
}


/* 
    VISUALISATION VIEWING AREA
*/
function ViewingArea() {
    const viewRef = useRef();
    const plotRef = useRef();
    const [rendering, isRendering] = useState(true);
    const [plt, setPlt] = useState({});

    // Handle Visualisation Data
    const [data, setData] = useState([]);
    const [info, setInfo] = useState({});
    useEffect(() => {
        
        axios.post('http://127.0.0.1:2000/ds/get-data', {
            song_id: "2ee4f5b3c328cb953f1e87a691007a26",
            data: "drum_track_energy",
            args: {pps: 5512, some_other_arg: 200}
        })
            .then(function (response) {
                console.log("data", response.data);
                
                setInfo(response.data.info);
                setData(response.data.data);
            })
            .catch(error => {
                console.log("Error retrieving datasets list!");
            })
    }, [])


    // Set visualisation dimensions
    const [viewBoxDimensions, setViewBoxDimensions] = useState({width: 0, height: 0});
    useEffect(() => {

        const dim = {
            getHeight: function() {
                return viewRef.current.offsetHeight;
            },
            getWidth: function() {
                return viewRef.current.offsetWidth;
            }
        }

        setViewBoxDimensions({width: dim.getWidth(), height: dim.getHeight()});
    }, [])



    // RENDER VISUALISATION
    useEffect(() => {
        
        let visPlot = d3.select(plotRef.current);

        
        //---DEFINE SCALING FUNCTIONS
        let xScale = d3.scaleLinear()
            .domain([0, 20])
            .range([0, viewBoxDimensions.width]);
        let yScale = d3.scaleLinear()
            .domain([-1, 1])
            .range([viewBoxDimensions.height, 0]);


        //---DEFINE VIS PARTS
        const ax_x = visPlot.append('g').attr('id', 'xAxis'); 
        const ax_x_top = visPlot.append('g').attr('id', 'xAxisTop');
        const ax_y = visPlot.append('g').attr('id', 'yAxis');


        //---SETUP AXES
        const setAxes = () => {
            
            // y axis
            let axisLeft = d3.axisLeft(yScale);
            ax_y.call(axisLeft);

            // x axis
            let axisBottom = d3.axisTop(xScale);
            let axisTop = d3.axisBottom(xScale).tickFormat("");
            ax_x.attr('transform', `translate(0, ${viewBoxDimensions.height})`)
                .style('overflow', 'hidden')
                .call(axisBottom);
            ax_x_top.attr('transform', `translate(0, 0)`)
                .style('overflow', 'hidden')
                .call(axisTop);

        }
        

        //---DEFINE ZOOM BEHAVIOUR
        const handleZoomAndDrag = ({ transform }) => {
            const zx = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
            const zx_bottom = transform.rescaleX(xScale).interpolate(d3.interpolateRound);
            ax_x.call(d3.axisTop(zx));
            ax_x_top.call(d3.axisBottom(zx_bottom).tickFormat(""));

            visPlot.selectAll('.data')  
                .attr('transform', `translate(${transform.x}, 0) scale(${transform.k}, 1)`);

        }

        const zoom = d3.zoom()
            .scaleExtent([1, 100])
            .translateExtent([[0, 0], [viewBoxDimensions.width, 0]])
            .filter(filter)
            .on("zoom", handleZoomAndDrag);
        
        
        
        //---RENDER PLOT
        setAxes();
        visPlot.call(zoom);
        


        //---RENDER PLOT DATA
        var vis_plot = {
            plot: visPlot,
            xScale: xScale,
            yScale: yScale,
            ax_x: ax_x,
            ax_y: ax_y,
            width: viewBoxDimensions.width,
            height: viewBoxDimensions.height,
        }

        setPlt(vis_plot);
        setPlayheadLoc(43.5);




        // Render Data
        if (data.length != 0) {
            console.log("Data has been found!");

            // Render Time Series
            const timeseries = new TimeSeries(data, info);
            timeseries.render(vis_plot, true);
        }


        // Render waveform data
        // const waveform = new Waveform3(data, info);
        // waveform.render(vis_plot, true);
        
        // // Render barlines
        // const barlines = new BarLines();
        // barlines.render(vis_plot);

        
        

        isRendering(false);

        

        // prevent scrolling then apply the default filter
        function filter(event) {
            event.preventDefault();
            return (!event.ctrlKey || event.type === 'wheel') && !event.button;
        }

        // Cleanup
        return () => {
            visPlot.on(".zoom", null);
        };

    }, [data])


    // HANDLE PLAYHEAD
    const [playheadLoc, setPlayheadLoc] = useState([]);
    useEffect(() => { // render playhead

        console.log(playheadLoc)
        
        if (Array.isArray(playheadLoc) && playheadLoc.length === 0) {
            return;
        }

        console.log(plt.plot);
        console.log(plt.xScale(playheadLoc));
        console.log(plt.height);
        
        (plt.plot).append('line')
            .attr('class', 'data playhead')
            .attr('x1', plt.xScale(playheadLoc))
            .attr('y1', 0)
            .attr('x2', plt.xScale(playheadLoc))
            .attr('y2', plt.height)
            .style('stroke', 'black')


    }, [playheadLoc, plt])
    
    
    
    return (
        <div id="viewingArea" ref={viewRef}>
            {
                rendering ? 
                <div>Loading Visualisation...</div>
                :
                <svg id="plotArea"
                    ref={plotRef}
                    viewBox={`0 0 ${viewBoxDimensions.width} ${viewBoxDimensions.height}`}>
                </svg>
            }
        </div>
    )
}


/* 
    TIME-VIS CONTROLS
*/
function VisControls(props) {
    const [value, setValue] = React.useState("");

    const [startTime, setStartTime] = useState(props.start_time);
    
    // handle play/pause controls
    const handlePlay = () => {

    }

    const handlePause = () => {

    }

    const handleSkipBack = () => {

    }

    const handleSkipForward = () => {

    }
    
    
    return (
        <div id="visControls">
            <Button
                size={SIZE.compact}
                overrides={{
                    BaseButton: { 
                        style: { 
                            borderRadius: '0px',
                            height: "25px",
                            width: "25px",
                            padding: "0px",
                            marginLeft: "20px",
                            marginRight: "5px"
                        } 
                    }
                }}>
                <RiSkipBackFill/>
            </Button>
            
            <Button
                size={SIZE.compact}
                overrides={{
                    BaseButton: { 
                        style: { 
                            borderRadius: '0px',
                            height: "25px",
                            width: "25px",
                            padding: "0px",
                            marginRight: "5px"
                        } 
                    }
                }}>
                <RiPlayFill/>
            </Button>

            <Button
                size={SIZE.compact}
                overrides={{
                    BaseButton: { 
                        style: { 
                            borderRadius: '0px',
                            height: "25px",
                            width: "25px",
                            padding: "0px",
                            marginRight: "5px"
                        } 
                    }
                }}
            >
                <RiSkipForwardFill/>
            </Button>

            <RiArrowLeftSLine/>


            <Select
                size={SIZE.compact}
                options={[
                    {
                    label: "AliceBlue",
                    id: "#F0F8FF"
                    },
                    {
                    label: "AntiqueWhite",
                    id: "#FAEBD7"
                    },
                    {
                    label: "Aqua",
                    id: "#00FFFF"
                    },
                    {
                    label: "Aquamarine",
                    id: "#7FFFD4"
                    },
                    {
                    label: "Azure",
                    id: "#F0FFFF"
                    },
                    {
                    label: "Beige",
                    id: "#F5F5DC"
                    }
                ]}
                value={value}
                placeholder="Rihanna - Disturbia"
                onChange={params => setValue(params.value)}

                overrides={{
                    Root: {
                        style: {
                            borderRadius: "0px",
                            width: "300px",
                        }
                    },
                    ControlContainer: {
                        style: {
                            backgroundColor: "white",
                            borderColor: "#161616",
                            border: "1px solid",
                            borderRadius: "0px",
                            height: "25px"
                        }
                    }
                }}
            />


            <RiArrowRightSLine/>
        </div>
    )
}