// Import is used only for local development
// import * as d3 from "../d3.v7.js";

function random_distribution() {
    const container = document.getElementById("noc-random-distribution");

    const svg = d3.select("#noc-random-distribution").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight)

    const x = d3.scaleLinear().domain([0, 100]).range([50, container.offsetWidth - 50]);
    const y = d3.scaleLinear().domain([0, 200]).range([container.offsetHeight - 24, 50]);

    svg.append("g")
        .attr("transform", "translate(50, 0)")
        .call(d3.axisLeft(y));

    const g = svg.append("g")
        .attr("transform", "translate(0," + (container.offsetHeight - 24) + ")")

    g.call(d3.axisBottom(x).ticks(10));

    const tick_width = (container.offsetWidth - 100) / 10;

    // Initialize an array with 10 numbers, all zeros first
    var random_numbers = []
    for (let i = 0; i < 10; i++) {
        random_numbers.push(0);
    }

    const t = d3.timer((elapsed) => {
        // Generate a random number between 0 and 9
        const index = Math.floor(Math.random() * random_numbers.length);

        // Increment the number at the index
        random_numbers[index]++;

        if (random_numbers[index] >= 200) {
            t.stop();
        }

        // Update the bars
        const bars = svg.selectAll("rect")
            .data(random_numbers);

        bars.enter().append("rect")
            .attr("x", (d, i) => x(i * 10) + (tick_width - 20) / 2)
            .attr("y", (d) => container.offsetHeight - 24)
            .attr("width", 20)
            .attr("height", 0)
            .style("fill", "steelblue")
            .merge(bars)
            .attr("y", (d) => y(d))
            .attr("height", (d) => container.offsetHeight - 24 - y(d));
    });
}

random_distribution();