/* 
    WAVEFORM VISUALISATION GENERATOR
*/
// generatres a waveform on a time-vis component
import * as d3 from "d3";


export class Waveform2 {
  
    constructor(data, info) {
        this.data = data;
        this.info = info;
    }

    render(plt, rerender_axis = false) {

        // Create data area
        let data_area = (plt.plot).append('g').attr('class', 'data waveform') //apend waveform data area

        // Create y-axis
        let data_max = d3.max(this.data, d => Math.abs(d));
        let padding = 0.5;
        var data_y = d3.scaleLinear()
            .domain([-(data_max + 0.2*data_max), data_max + 0.2*data_max])
            .range([plt.height, 0]);


        // Rerender y-axis if called from render function
        if (rerender_axis === true) { //check if the call wants us to rerender an axis
            let axisLeft = d3.axisLeft(data_y);
            (plt.ax_y).selectAll('*').remove(); //remove old axis

            (plt.ax_y).call(axisLeft); //create new axis
        }


        console.log(this.data)
        var pixels = plt.xScale.range()[1];

        // Render Data
        data_area.append("path")
            .datum(this.data)
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 0.5)
            .attr("d", d3.line()
                .x((d, i) => plt.xScale(i * this.info["duration"]/this.data.length))
                .y(d => data_y(d))
            )
    }
        
    
}