/* 
    TIME SERIES VISUALISATION GENERATOR
*/
// generatres a time series plot
import * as d3 from "d3";



export class TimeSeries {

    constructor(data, info, layer_name) {
        this.data = data;
        this.info = info;
        this.layer_name = layer_name;
    }

    /*Render Time Series on plot plt*/
    render(plt, rerender_axis) {

        // Set up data area
        this.data_area = plt.plot.append('g')
            .attr('class', 'data timeseries')
            .attr('id', this.layer_name);


        // Find maximum and minimum values for setting up scales
        let y_max = d3.max(this.data.data);
        let y_min = d3.min(this.data.data);

        let t_max = d3.max(this.data.times);
        let t_min = d3.min(this.data.times);
        let duration = t_max - t_min;


        // Set up y-axis
        var time_series_scale = d3.scaleLinear()
            .domain([y_min, y_max + 0.2*y_max])
            .range([plt.height, 0])

        if (rerender_axis === true) { // Render Axis if needed
            plt.yScale = time_series_scale;
            
            let axisLeft = d3.axisLeft(plt.yScale);
            plt.ax_y.selectAll('*').remove(); //remove old axis
            plt.ax_y.call(axisLeft); //create new axis
        }



        // Render data
        const dataPoints = this.data.data.map((d, i) => ({ data: d, times: this.data.times[i] }));

        this.data_area.append("path")
            .datum(dataPoints)
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function(d) { return plt.xScale(d.times) })
                .y(function(d) { return plt.yScale(d.data) })
            )

    }
}