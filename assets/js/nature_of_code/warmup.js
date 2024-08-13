// Import is used only for local development
// import * as d3 from "../d3.v7.js";

function warmup() {
  const container = document.getElementById("noc-warmup");

  const svg = d3.select("#noc-warmup").append("svg")
    .attr("width", container.offsetWidth)
    .attr("height", container.offsetHeight)
    .style("background-color", "lightgrey");

  const t = d3.timer((elapsed) => {
    svg.append("circle")
      .attr("cx", Math.random() * svg.attr("width"))
      .attr("cy", Math.random() * svg.attr("height"))
      .attr("r", Math.random() * 16 + 1)
      .style("fill", "rgba(0, 0, 0, 0.1")
      .style("stroke", "rgba(0, 0, 0, 0.2")

    if (elapsed > 15000) {
      t.stop();
    }
  });
}

warmup();