/* 
    BAR LINES GENERATOR
*/
// generatres a waveform on a time-vis component
import * as d3 from "d3";

export class BarLines {

    constructor() {
        this.data = [];

        let value = 3.32;
        while (value < 326) {
            this.data.push(value);
            value += 19/3;
        }
    }

    render(plt) {

        this.barlines_area = plt.plot.append('g').attr('class', 'data barlines');

        this.barlines_area.selectAll('line')
            .data(this.data)
            .enter()
            .append('line')
            .attr('x1', d => plt.xScale(d))
            .attr('x2', d => plt.xScale(d))
            .attr('y1', 0)
            .attr('y2', plt.height)
            .attr('stroke', '#6b6b6b')
            .attr('stroke-width', 0.5)
            .attr('stroke-dasharray', '2, 2')

    }


}