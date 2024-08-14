function bouncing_ball() {
    const container = document.getElementById("noc-compare-bouncing-ball");

    const svg = d3.select("#noc-compare-bouncing-ball").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight);

    let x = container.offsetWidth / 2;
    let y = container.offsetHeight / 2;
    let xspeed = 2.5;
    let yspeed = 2;

    const t = d3.interval((elapsed) => {
        svg.selectAll("*").remove();

        x += xspeed;
        y += yspeed;

        if (x > container.offsetWidth || x < 0) {
            xspeed *= -1;
        }

        if (y > container.offsetHeight || y < 0) {
            yspeed *= -1;
        }

        svg.append("circle")
            .attr("cx", x)
            .attr("cy", y)
            .attr("r", 48)
            .attr("fill", "steelblue");

        if (elapsed > 10000) {
            t.stop();
        }
    }, 1000 / 60);
}

bouncing_ball();