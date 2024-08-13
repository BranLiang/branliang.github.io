function perlin_noise() {
    const container = document.getElementById("noc-compare-perlin-noise");

    const svg = d3.select("#noc-compare-perlin-noise").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight)

    const line = d3.line()
        .x((d, i) => i)
        .y((d) => d);

    noise.seed(Math.random());
    let xoff = 0;
    const points = [];
    for (let i = 0; i < container.offsetWidth; i++) {
        const y = noise.perlin2(xoff, 0) * container.offsetHeight / 2 + container.offsetHeight / 2;
        points.push(y);
        xoff += 0.01
    }

    const t = d3.interval((elapsed) => {
        svg.selectAll("*").remove();

        points.shift();
        const y = noise.perlin2(xoff, 0) * container.offsetHeight / 2 + container.offsetHeight / 2;
        points.push(y);

        svg.append("path")
            .attr("d", line(points))
            .attr("fill", "none")
            .attr("stroke", "green")
            .attr("stroke-width", 2);

        xoff += 0.01
    }, 1000 / 60);
}

perlin_noise();

function random_noise() {
    const container = document.getElementById("noc-compare-random-noise");
    
    const svg = d3.select("#noc-compare-random-noise").append("svg")
    .attr("width", container.offsetWidth)
    .attr("height", container.offsetHeight)
    
    const line = d3.line()
        .x((d, i) => i)
        .y((d) => d);
    
    const random = d3.randomUniform(container.offsetHeight);
    const points = [];
    for (let i = 0; i < container.offsetWidth; i++) {
        const y = random();
        points.push(y);
    }

    const t = d3.interval((elapsed) => {
        svg.selectAll("*").remove();

        points.shift();
        const y = random();
        points.push(y);

        svg.append("path")
            .attr("d", line(points))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1);
    }, 1000 / 60);
}

random_noise();

