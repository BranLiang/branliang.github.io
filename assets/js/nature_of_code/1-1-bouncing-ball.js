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

        let circle = svg.selectAll("circle");
        let databoundedCircle = circle.data([{ x, y }]);
        databoundedCircle.join(
            enter => enter.append("circle")
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y)
                .attr("r", 48)
                .attr("fill", "steelblue"),
            update => update
                .attr("cx", (d) => d.x)
                .attr("cy", (d) => d.y),
        )

        if (elapsed > 50000) {
            t.stop();
        }
    }, 1000 / 60);
}

bouncing_ball();