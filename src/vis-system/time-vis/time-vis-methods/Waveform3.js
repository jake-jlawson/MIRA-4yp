/* 
    WAVEFORM VISUALISATION GENERATOR
*/
// generatres a waveform on a time-vis component
import * as d3 from "d3";


export class Waveform3 {

    constructor(data, info) {
        this.data = data;
        this.info = info;
    }

    /*Render Waveform on plot plt*/
    render(plt, rerender_axis) {

        // Summarise audio samples
        let available_pixels = plt.width;
        let spp = this.info["duration"] / available_pixels;

        let samples_summary = this.summarise(available_pixels, "AverageMaxMin", true);


        //Only filter if data is available
        // if (this.data.length != 0) {
        //     filter(samples_summary, spp);
        // }
        
        


        // Find peak values
        let peak = d3.max(samples_summary, d => Math.max(Math.abs(d.max), Math.abs(d.min)));
        let padding = 0.3 * (2*peak);


        // Set up axes
        var waveform_scale = d3.scaleLinear()
            .domain([-(peak + padding), (peak+padding)])
            .range([plt.height, 0])


        // Render Axis if needed
        if (rerender_axis === true) {
            plt.yScale = waveform_scale;
            
            let axisLeft = d3.axisLeft(plt.yScale);
            plt.ax_y.selectAll('*').remove(); //remove old axis
            plt.ax_y.call(axisLeft); //create new axis
        }



        // Render Waveform
        this.waveform_area = plt.plot.append('g').attr('class', 'data waveform');

        this.waveform_area.selectAll('rect')
            .data(samples_summary)
            .enter()
            .append('rect')
            .style('shape-rendering', 'crispEdges')
            .style('fill', '#a42be0')
            .style('opacity', 0.2)

            //bar positions
            .attr('x', (d, i) => {
                // console.log(d);
                return plt.xScale(i * this.info["duration"]/available_pixels);
            })

            .attr('y', d => {
                return (plt.height / 2) - (Math.abs(plt.yScale(d.max) - plt.yScale(d.min)) / 2);
            })

            //bar dimensions
            .attr('width', 1)
            .style('height', d => {
                return Math.abs(plt.yScale(d.max) - plt.yScale(d.min))
            })

    }

    rerender() {
        return;
    }


    summarise(pixels, algorithm, log_scale) {

        //Split data into chunks corresponding to pixel values
        const split = (arr, n) => {
            let size = Math.floor(arr.length / n);

            return Array.from({ length: n },
                (v, i) => arr.slice(i * size, i * size + size)
            )
        }

        var chunks = split(this.data, pixels);
        
        
        
        //Apply summarisation algorithm
        var new_data = [];

        chunks.forEach((chunk) => {
            
            if (algorithm === "MinMax") {
                var chunk_summary = MinMax(chunk);
            } 
    
            else if (algorithm === "AverageMaxMin") {
                var chunk_summary = AverageMaxMin(chunk);
            }
    
            else if (algorithm === "RMSEnergy") {
                var chunk_summary = RMSEnergy(chunk);
            }

            else if (algorithm === "Median") {
                var chunk_summary = Median(chunk);
            }
    
            else if (algorithm === "EnvelopeEstimation") {
                return;
            }


            //Convert to log scale if required
            if (log_scale === true) {
                chunk_summary["max"] = 10*Math.log10(Math.abs(chunk_summary["max"]) + 1);
                chunk_summary["min"] = -10*Math.log10(Math.abs(chunk_summary["min"]) + 1);
            }

            new_data.push(chunk_summary);
        })

        return new_data;
    }

}



/*
    SUMMARISATION ALGORITHMS
*/

function MinMax(data) {
   
    //compute maximum value
    let max = d3.max(data);

    //compute minimum value
    let min = d3.min(data);


    return {"max": max, "min": min}
}


function AverageMaxMin(data) {
    
    let pos_vals = data.filter(value => value >= 0);
    let pos_avg = pos_vals.reduce((partialSum, a) => partialSum + a, 0) / pos_vals.length;

    let neg_vals = data.filter(value => value <= 0);
    let neg_avg = neg_vals.reduce((partialSum, a) => partialSum + a, 0) / neg_vals.length;
    
    
    return {"max": pos_avg, "min": neg_avg};
}


function RMSEnergy(data) {
    
    let sum = 0;
    
    for (let i = 0; i < data.length; i++) {
        sum += data[i] * data[i];
    }
  
    let rmsAvg = Math.sqrt(sum / data.length);
    
    
    return {"max": rmsAvg, "min": -rmsAvg};
}


function Median(data) {
    
    let pos_vals = data.filter(value => value >= 0);
    let pos_median = d3.median(pos_vals);

    let neg_vals = data.filter(value => value <= 0);
    let neg_median = d3.median(neg_vals);
    
    
    return {"max": pos_median, "min": neg_median};
}


/*
    FILTERING ALGORITHMS
*/
function filter(data, spp) {

    let window_size_s = 5;
    let window_pixels = Math.floor(window_size_s / spp);



    //iterate through 
    for (let i=0; i<data.length; i+=window_pixels) {

        let chunk = data.slice(i, i + window_pixels);

        //calculate mean and standard deviation of chunk
        let pos_mean = d3.mean(chunk, d => d.max);
        console.log("positive mean", pos_mean);
        let pos_sd = d3.deviation(chunk, d => d.max);
        let neg_mean = d3.mean(chunk, d => d.min);
        console.log("negative mean", neg_mean);
        let neg_sd = d3.deviation(chunk, d => d.min);


        let threshold = 1;
        let pos_threshold = pos_mean + threshold*pos_sd;
        console.log("positive threshold", pos_threshold);
        let neg_threshold = neg_mean - threshold*neg_sd;
        console.log("negative threshold", neg_threshold);


        //limit values above 2 standard deviations from mean
        for (let j=0; j<chunk.length; j++) {
            if (chunk[j].max > pos_threshold) {
                chunk[j].max = pos_threshold;
            }

            if (chunk[j].min < neg_threshold) {
                chunk[j].min = neg_threshold;
            }
        }

        data.splice(i, window_pixels, ...chunk);
    }

    
}