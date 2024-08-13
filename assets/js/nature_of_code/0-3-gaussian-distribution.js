function gaussian_distribution() {
    const container = document.getElementById("noc-gaussian-distribution");

    const svg = d3.select("#noc-gaussian-distribution").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight)
        .style("background-color", "lightgrey");

    const t = d3.timer((elapsed) => {
        svg.append("circle")
            .attr("cx", d3.randomNormal(320, 60))
            .attr("cy", container.offsetHeight / 2)
            .attr("r", 16)
            .style("fill", "rgba(0, 0, 0, 0.05")

        if (elapsed > 15000) {
            t.stop();
        }
    });
}

gaussian_distribution();