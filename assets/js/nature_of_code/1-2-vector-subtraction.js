function vector_subtraction() {
    const container = document.getElementById("noc-vector-subtraction");

    const svg = d3.select("#noc-vector-subtraction").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight);

    const start = new Victor(container.offsetWidth / 3, container.offsetHeight / 3);
    const end = new Victor(container.offsetWidth / 3 * 2, container.offsetHeight / 3 * 2);

    svg.append("line")
        .attr("x1", start.x)
        .attr("y1", start.y)
        .attr("x2", end.x)
        .attr("y2", end.y)
        .attr("stroke", "lightgray")
        .attr("stroke-width", 2);

    container.addEventListener("mousemove", (event) => {
        const [x, y] = d3.pointer(event);
        const mouse = new Victor(x, y);

        let lines = svg.selectAll("line");
        let databoundedLines = lines.data([[start, end], [start, mouse], [mouse, end]]);
        databoundedLines.join(
            enter => enter.append("line")
                .attr("x1", (d) => d[0].x)
                .attr("y1", (d) => d[0].y)
                .attr("x2", (d) => d[1].x)
                .attr("y2", (d) => d[1].y)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2),
            update => update
                .attr("x1", (d) => d[0].x)
                .attr("y1", (d) => d[0].y)
                .attr("x2", (d) => d[1].x)
                .attr("y2", (d) => d[1].y),
            exit => exit.remove()
        );
    });
}

vector_subtraction();