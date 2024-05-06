import * as d3 from "d3";



    const zoom = d3.zoom()
        .scaleExtent([0.5, 32])
        .on("zoom", zoomed),
  
  
    const gx = svg.append("g");
  
    const gy = svg.append("g");
  
    svg.call(zoom).call(zoom.transform, d3.zoomIdentity);
  
    function zoomed({transform}) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      gDot.attr("transform", transform).attr("stroke-width", 5 / transform.k);
      gx.call(xAxis, zx);
      gy.call(yAxis, zy);
      gGrid.call(grid, zx, zy);
    }
  
    return Object.assign(svg.node(), {
      reset() {
        svg.transition()
            .duration(750)
            .call(zoom.transform, d3.zoomIdentity);
      }
    });
  }