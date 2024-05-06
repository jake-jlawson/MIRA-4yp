/* 
    WAVEFORM VISUALISATION GENERATOR
*/
// generatres a waveform on a time-vis component
import * as d3 from "d3";
import { TbMathSymbols } from "react-icons/tb";


export class Waveform {
  
    constructor(data, info) {
        this.data = data;
        this.info = info;
    }

    render(plt, rerender_axis = false) {

        if (rerender_axis === true) { //check if the call wants us to rerender an axis

            // find maximum absolute value of data
            let max = d3.max(this.data, d => Math.abs(d));
            console.log(max);
            let log_max = 10*Math.log10(max + 1);
            let spacing = 0 //spacing above and below the waveform (as proportional of max)
            
            // set y-axis scale
            plt.yScale = d3.scaleLinear()
                .domain([-(max + spacing*max), (max + spacing*max)])
                .range([plt.height, 0]);


            // append y-axis
            let axisLeft = d3.axisLeft(plt.yScale);
            (plt.ax_y).selectAll('*').remove(); //remove old axis

            (plt.ax_y).call(axisLeft); //create new axis

        }
        
        
        let sr = this.info["sample_rate"]; // get sample rate


        //Cut data down according to x values
        var pixels = plt.xScale.range()[1];
        var data = this.cut(pixels);

        console.log(data);
        console.log(this.data);

        
        // Render Data
        let data_area = (plt.plot).append('g').attr('class', 'data waveform') //apend waveform data area
        
        data_area.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .style('fill', 'blue')
            .attr('x', (d, i) => {
                // console.log(d);
                return plt.xScale(i * this.info["duration"]/pixels);
            })
            .attr('y', d => {
                return (plt.height / 2) - (2*Math.abs(plt.yScale(d.max) - plt.yScale(d.min)) / 2);
            })
            .attr('width', 1)
            .style('height', d => {
                return 2*Math.abs(plt.yScale(d.max) - plt.yScale(d.min))
            })
            .style('opacity', 0.2)
            
            
            
            
            .attr('fill', 'black');
    }

    cut(n) {
        
        var data = [];
        var max = d3.max(this.data, d => Math.abs(d));
        
        // split the data into n bins
        const split = (arr, n) => {
            let size = Math.floor(arr.length / n);

            return Array.from({ length: n },
                (v, i) => arr.slice(i * size, i * size + size)
            )
        }
        
        var bins = split(this.data, n)

        
        // find the max and min of each bin
        bins.forEach((bin) => {
            
            let pos_vals = bin.filter(value => value > 0);
            let pos_avg = pos_vals.reduce((partialSum, a) => partialSum + a, 0) / pos_vals.length;

            let neg_vals = bin.filter(value => value < 0);
            let neg_avg = neg_vals.reduce((partialSum, a) => partialSum + a, 0) / neg_vals.length;

            
            // let log_max = d3.max(bin, d => Math.log10(Math.abs(d) + 1))
            // let log_min = d3.min(bin, d => Math.log10(Math.abs(d) + 1))
            
            
            // data.push({"max": 10*log_max, "min": -10*log_min})

            data.push({"max": pos_avg, "min": neg_avg})
        })

        return data
    }


    energy_cut(n) {
        var data = [];
        var max = d3.max(this.data, d => Math.abs(d));
        
        // split the data into n bins
        const split = (arr, n) => {
            let size = Math.floor(arr.length / n);

            return Array.from({ length: n },
                (v, i) => arr.slice(i * size, i * size + size)
            )
        }
        
        var bins = split(this.data, n)

        
        // find the max and min of each bin
        bins.forEach((bin) => {

            //Compute average signal energy for each bin
            let sum = 0;

            for (let i = 0; i<bin.length; i++) {
                sum += Math.pow(bin[i], 2);
            }


            data.push({"max": sum / bin.length, "min": -(sum / bin.length)})
        })

        return data
    }
}