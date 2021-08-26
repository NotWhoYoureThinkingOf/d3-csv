import React, { useRef, useEffect, useState } from "react";
import {
  select,
  line,
  curveCardinal,
  scaleLinear,
  axisBottom,
  axisRight,
  min,
  max,
  scaleTime,
} from "d3";
import useResizeObserver from "./useResizeOberserver";

function CsvBarChart({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log("dimensions", dimensions);

    if (!dimensions) return;

    // Set the ranges (for labels)
    const margin = 200;
    const width = svg.attr("width") - margin; //300
    const height = svg.attr("height") - margin; //200

    // domain is our input values, range is visual representation of the data
    const xScale = scaleLinear()
      .domain([0, data.length - 1])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([0, max(data) * 1.5])
      .range([150, 0]);

    // making x-axis and assigning it to g element in the jsx
    const xAxis = axisBottom(xScale)
      .ticks(data.length)
      .tickFormat((index) => index + 1);

    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // making y-axis and assigning it to g element in the jsx
    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    // generates the "d" attribute of a path element
    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    // renders path elements and attaches "d" attribute from line generator above
    svg
      .selectAll(".line")
      .data([data])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue")
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke-dashoffset", function () {
        const length = this.getTotalLength();
        return length;
      })
      .transition()
      .duration(1500)
      .attr("stroke-dashoffset", 0);

    // labels
    svg.selectAll("circle").data(data).enter().append("circle");
    // .attr("cx", function (d) {
    //   return x(d.date);
    // })
    // .attr("cy", function (d) {
    //   return y(d.close);
    // });
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
        <g className="y-axis" />
      </svg>
    </div>
  );
}

export default CsvBarChart;
