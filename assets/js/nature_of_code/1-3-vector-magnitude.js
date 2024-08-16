import SvgContainer from "./canvas.js";

class VectorMagnitude extends SvgContainer {
    constructor(id) {
        super(id);
    }

    run() {
        const orgin = new Victor(this.container.offsetWidth / 2, this.container.offsetHeight / 2);

        this.container.addEventListener("mousemove", (event) => {
            const [x, y] = d3.pointer(event);
            const mouse = new Victor(x, y);

            this.svg.selectAll("line")
                .data([[orgin, mouse]])
                .join("line")
                .attr("x1", (d) => d[0].x)
                .attr("y1", (d) => d[0].y)
                .attr("x2", (d) => d[1].x)
                .attr("y2", (d) => d[1].y)
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2);

            this.svg.selectAll("rect")
                .data([orgin.distance(mouse)])
                .join("rect")
                .attr("x", 20)
                .attr("y", 20)
                .attr("width", (d) => d)
                .attr("height", 16)
                .attr("fill", "steelblue");
        });
    }
}

const vectorMagnitude = new VectorMagnitude("noc-vector-magnitude");
vectorMagnitude.run();