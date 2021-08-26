import React, { useRef, useEffect } from "react";
import { select, min, max, scaleTime, axisBottom, scaleLinear } from "d3";
import useResizeObserver from "./useResizeOberserver";

const getDate = (dateString) => {
  const date = dateString.split("-");
  return new Date(date[2], date[0] - 1, date[1]);
};

const BBTimeline = ({ data, highlight }) => {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const minDate = min(data, (episode) => getDate(episode.air_date));
    const maxDate = max(data, (episode) => getDate(episode.air_date));
    console.log("minDate", minDate);
    console.log("maxDate", maxDate);

    // define the scale of the x axis (Start and finish, and optionally midpoints)
    const xScale = scaleTime()
      .domain([minDate, maxDate])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([max(data, (episode) => episode.characters.length), 0])
      .range([0, dimensions.height]);

    // select all the existing elements with the class of .episode and synch them with the data that we give it (data). for every episode which is still missing, create a new line element in the svg and attach the class of episode to them so they can be updated later
    svg
      .selectAll(".episode")
      .data(data) // data array
      .join("line")
      .attr("class", "episode")
      // if the episode includes the chosen character, the line will be blue. Otherwise it will be black
      .attr("stroke", (episode) =>
        episode.characters.includes(highlight) ? "red" : "black"
      )
      // need to use a callback function that takes the current episode in the data array and uses the xScale function we defined to transform the episode into a pixel value on the timeline
      .attr("x1", (episode) => xScale(getDate(episode.air_date)))
      .attr("y1", dimensions.height) // will place line at bottom cause it's the whole height
      .attr("x2", (episode) => xScale(getDate(episode.air_date)))
      .attr("y2", (episode) => yScale(episode.characters.length));

    // applying the scale we just defined to D3's axisBottom
    const xAxis = axisBottom(xScale);

    // selecting the svg element in the jsx with className 'x-axis' and applying the D3 scale to it
    // style here is just moving the x-axis scale to the bottom, otherwise it floats at the top
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    // draw the guage
  }, [data, dimensions, highlight]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}>
        <g className="x-axis" />
      </svg>
    </div>
  );
};

export default BBTimeline;
