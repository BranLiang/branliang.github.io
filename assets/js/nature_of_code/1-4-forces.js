function noc_forces() {
    const container = document.getElementById('noc-forces');
    const svg = d3.select(`#noc-forces`).append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight);

    var data = [
        { label: "Ball", x: container.offsetWidth / 2, y: 0 },
    ];

    let simulation = d3.forceSimulation(data)
        .velocityDecay(0)

    simulation.stop();

    const t = d3.interval(_ => {
        gravity();
        bounce();
        simulation.tick();
        svg.selectAll("circle")
            .data(data)
            .join("circle")
            .attr("cx", (d) => d.x)
            .attr("cy", (d) => d.y)
            .attr("r", 20)
            .attr("fill", "steelblue");

    }, 1000 / 60);

    container.addEventListener("click", (event) => {
        const [x, y] = d3.pointer(event);

        if (x > data[0].x) {
            data[0].vx -= -0.5;
        }

        if (x < data[0].x) {
            data[0].vx += -0.5;
        }
    });

    function gravity() {
        for (let i = 0; i < data.length; i++) {
            let node = data[i];
            node.vy += 0.025;
        }
    }

    function bounce() {
        for (let i = 0; i < data.length; i++) {
            let node = data[i];
            if (node.y > container.offsetHeight - 10 && node.vy > 0) {
                node.vy *= -0.95;
                if (node.vy < 0.1 && node.vy > -0.1) {
                    console.log("stopped");
                    t.stop();
                }
            }

            if (node.x < 10 || node.x > container.offsetWidth - 10) {
                node.vx *= -1;
            }
        }
    }
}

noc_forces();