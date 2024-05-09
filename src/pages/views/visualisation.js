/*
    SINGLE VIEW PANEL
    __Provides a single visualisation__
*/

/* IMPORTS */
import React, { useState } from 'react';

import './visualisation.css'; //views css
import { useProject } from '../../utils/ProjectContextProvider';

/*BASEWEB IMPORTS*/
import { LabelXSmall, HeadingLarge } from 'baseui/typography';

import { StatelessAccordion, Panel } from "baseui/accordion";
import { Tag, KIND, VARIANT } from "baseui/tag";
import { StyledDivider, SIZE } from "baseui/divider";
import { Slider } from "baseui/slider";
import { 
    RiLayoutBottom2Line, 
    RiEyeLine,
    RiEyeOffLine, 
    RiSettings3Line,
    RiAddFill } from "react-icons/ri";
import {
    List,
    arrayMove,
    arrayRemove
  } from "baseui/dnd-list";


/* IMPORT VISUALISATIONS*/
import TimeVis from '../../vis-system/time-vis/TimeVis';
import { useStyletron } from 'styletron-react';
import { color } from 'd3';


export default function Visualisation() {
    const [viewSettings, setViewSettings] = useState({})
    
    return (
        <>
            {/*Visualisation Title*/}
            <div id="visTitle">
                <HeadingLarge margin="0px" className='vis-title'
                    overrides={{
                        Block: {
                            style: {
                                color: "#cfcfcf",
                                fontSize: "50px",
                                marginTop: "10px",
                                marginBottom: "10px"
                            }
                        }
                    }}>
                    Melody Plot Visualisation
                </HeadingLarge>
            </div>
            
            <div id="visPanelContainer">
                
                {/*Visualisation Controls*/}
                <div id='viewSidebar'>
                    <AreaTitle title="Plots Control"/>
                    <PlotsControl />
                </div>

                {/*Visualisation Viewing Area*/}
                <div id='viewArea'>
                    {/* <AreaTitle title="SubPlot1"/> */}
                    <TimeVis />
                </div>
            </div>
            
        </>
    )
}

function AreaTitle(props) {
    return (
        <div className='area-title'>
            <LabelXSmall className='vis-title' color="#9d9d9d">{props.title}</LabelXSmall>

            <div id="divider"></div>

            <RiAddFill size={15} cursor="pointer" color='#9d9d9d'/>
        </div>
    )
}


function PlotsControl() {
    const [css] = useStyletron();
    const [expanded, setExpanded] = React.useState(['L1', 'L2']);
    
    return (
        <div className='visualisation-area'>
            <StatelessAccordion 
                expanded={expanded}
                onChange={({key, expanded}) => {
                    console.log(key);
                    setExpanded(expanded);
                }}
                accordion={false}>
                
                <Panel 
                    key="P1"
                    title={
                        <div className={css({ display: "flex", alignItems: "center", gap: "5px" })}>
                            <RiLayoutBottom2Line size={15} />
                            SubPlot1
                        </div>
                    }
                    overrides={{
                        Root: {
                            border: "1px solid #e8e8e8"
                        },
                        Header: {
                            style: {
                                height: "40px",
                                fontSize: "12px",
                                borderBottom: "1px solid #e8e8e8",
                                borderRight: "1px solid #e8e8e8"
                            }
                        },
                        ToggleIcon: {
                            style: {
                                width: "20px",
                            }
                        },
                        Content: {
                            style: {
                                padding: "2px 10px 5px 10px",
                                backgroundColor: "white"
                            }
                        }
                    }}
                >
                    <PlotsLayers items={["main", "vocals"]}/>
                </Panel>

                <Panel 
                    key="P2"
                    title={
                        <div className={css({ display: "flex", alignItems: "center", gap: "5px" })}>
                            <RiLayoutBottom2Line size={15} />
                            SubPlot2
                        </div>
                    }
                    overrides={{
                        Header: {
                            style: {
                                height: "40px",
                                fontSize: "12px",
                                borderBottom: "1px solid #e8e8e8",
                                borderRight: "1px solid #e8e8e8"
                            }
                        },
                        ToggleIcon: {
                            style: {
                                width: "20px",
                            }
                        },
                        Content: {
                            style: {
                                padding: "2px 15px 5px 15px",
                                backgroundColor: "white"
                            }
                        }
                    }}
                >
                    <PlotsLayers items={["main", "energy", "lyrics"]} />
                </Panel>

            </StatelessAccordion>
        </div>
    )
}


function PlotsLayers(props) {
    const [items, setItems] = React.useState(props.items);

      return (
        <List
          items={items}
          onChange={({ oldIndex, newIndex }) =>
            setItems(
              newIndex === -1
                ? arrayRemove(items, oldIndex)
                : arrayMove(items, oldIndex, newIndex)
            )
          }

          overrides={{
            Item: {
                style: {
                    height: "30px",
                    justifyContent: "left",
                    padding: "0px 3px 0px 10px",
                    fontSize: "10px",
                    backgroundColor: "white",
                    borderRadius: "5px",
                    margin: "5px 0px",
                    color: "#161616"
                }
            },
            DragHandle: {
                style: {
                    width: "15px",
                    color: "#161616",
                    marginRight: "8px"
                }
            },
            Label: {
                component: ({ $value }) => (
                    <div style={{ flexGrow: 1 }} id="layerControl">
                        {$value}
                      
                      
                      
                      
                      <LayerControl />
                    </div>
                    
                  )
            }
          }}
        />
      );
}


function LayerControl() {
    const [layerColor, setLayerColor] = useState("#1023eb")
    const [opacity, setOpacity] = useState([50])
    
    return (
        <div id="layerTab">
            <Slider
                value={opacity}
                onChange={({ value }) => value && setOpacity(value)}
                onFinalChange={({ value }) => console.log(value)}

                overrides={{
                    Root: {
                        style: {
                            width: "60px",
                            padding: "0px",
                        }
                    },
                    TickBar: {
                        style: {
                            display: "none"
                        }
                    },
                    Thumb: {
                        style: {
                            width: "3px",
                            height: "8px",
                        }
                    },
                    Track: {
                        style: {
                            padding: "0px 10px",
                        }
                    
                    }
                }}
            />
            
            
            <Tag 
                closeable={false}
                variant={VARIANT.outlined}
                kind={KIND.custom}
                color={layerColor}

                overrides={{
                    Root: {
                        style: {
                            fontSize: "8px",
                            height: "15px",
                            width: "auto",
                            padding: "0px 3px",
                            margin: "0px"
                        }
                    }
                }}
                
            >
                {layerColor}
            </Tag>

            <RiSettings3Line size={15} strokeWidth={0.1} className='icon settings-icon'/>

            <RiEyeLine size={15} strokeWidth={0.1} className='icon'/>
            
            

            {/* <Slider
                value={opacity}
                onChange={({ value }) => value && setOpacity(value)}
                onFinalChange={({ value }) => console.log(value)}
                overrides={{
                    Root: {
                        style: {
                            flexShrink: "1"
                        }
                    }
                }}
            /> */}
        </div>
    )
}