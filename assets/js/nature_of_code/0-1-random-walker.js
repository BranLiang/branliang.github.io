// Import is used only for local development
// import * as d3 from "../d3.v7.js";

function random_walk() {
    class Walker {
        constructor(width, height) {
            this.x = width / 2;
            this.y = height / 2;
            this.width = width;
            this.height = height;
        }

        draw(svg) {
            svg.append("circle")
                .attr("cx", this.x)
                .attr("cy", this.y)
                .attr("r", 1)
                .style("fill", "rgba(0, 0, 0, 0.3")
        }

        step() {
            let r = Math.random();
            if (r < 0.4) {
                this.x++;
            } else if (r < 0.6) {
                this.x--;
            } else if (r < 0.8) {
                this.y++;
            } else {
                this.y--;
            }

            this.x = Math.min(this.width, Math.max(0, this.x));
            this.y = Math.min(this.height, Math.max(0, this.y));
        }
    }

    const container = document.getElementById("noc-random-walker");

    const svg = d3.select("#noc-random-walker").append("svg")
        .attr("width", container.offsetWidth)
        .attr("height", container.offsetHeight)
        .style("background-color", "lightgrey");

    const walker = new Walker(container.offsetWidth, container.offsetHeight);
    const t = d3.timer((elapsed) => {
        walker.step();
        walker.draw(svg);

        if (elapsed > 50000) {
            t.stop();
        }
    });
}

random_walk();