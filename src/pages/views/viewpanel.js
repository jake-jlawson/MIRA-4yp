/*
    SINGLE VIEW PANEL
    __Provides a single visualisation__
*/

/* IMPORTS */
import React, { useState } from 'react';

import './viewpanel.css'; //views css
import { useProject } from '../../utils/ProjectContextProvider';

/*BASEWEB IMPORTS*/
import { LabelLarge } from 'baseui/typography';
import { Accordion, Panel } from "baseui/accordion";
import { Tag, KIND, VARIANT } from "baseui/tag";
import { Slider } from "baseui/slider";
import { RiLayoutBottom2Line } from "react-icons/ri";
import {
    List,
    arrayMove,
    arrayRemove
  } from "baseui/dnd-list";


/* IMPORT VISUALISATIONS*/
import TimeVis from '../../vis-system/time-vis/TimeVis';
import { useStyletron } from 'styletron-react';
import { color } from 'd3';


export default function ViewPanel() {
    const [viewSettings, setViewSettings] = useState({})
    
    
    
    
    return (
        <>
            <div id='viewSidebar'>
                <PlotsControl />
            </div>

            <div id='viewArea'>
                <LabelLarge>Visualisation Name</LabelLarge>
                <TimeVis />
                <TimeVis />
            </div>
        </>
    )
}


function PlotsControl() {
    const [css] = useStyletron();
    
    return (
        <>
            <Accordion onChange={({ expanded }) => console.log(expanded)}>
                
                <Panel 
                    title={
                        <div className={css({ display: "flex", alignItems: "center", gap: "5px" })}>
                            <RiLayoutBottom2Line size={15} />
                            SubPlot 1
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
                    <PlotsLayers items={["main", "vocals"]}/>
                </Panel>

                <Panel 
                    title={
                        <div className={css({ display: "flex", alignItems: "center", gap: "5px" })}>
                            <RiLayoutBottom2Line size={15} />
                            SubPlot 2
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
                    <PlotsLayers items={["main", "vocal_melody", "energy_peaks"]} />
                </Panel>

            </Accordion>
        </>
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
                    padding: "0px 10px",
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
                }
            },
            Label: {
                component: ({ $value }) => (
                    <div style={{ flexGrow: 1 }}>
                      {$value}{" "}
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
        <>
            <Tag 
                closeable={false}
                variant={VARIANT.outlined}
                kind={KIND.custom}
                color={layerColor}
                
            >
                {layerColor}
            </Tag>

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
        </>
    )
}