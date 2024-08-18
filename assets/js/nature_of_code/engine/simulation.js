export default class Simulation {
    #forces = [];
    #movers = [];
    #process;
    #svg;
    #container;

    constructor(id) {
        this.#container = document.getElementById(id);
        this.#svg = d3.select(`#${id}`).append("svg")
            .attr("width", this.container.offsetWidth)
            .attr("height", this.container.offsetHeight);
        this.#forces = [];
        this.#movers = [];
        this.#process = null;
    }

    addForce(force) {
        this.#forces.push(force);
    }

    addMover(mover) {
        this.#movers.push(mover);
    }

    run() {
        this.#process = d3.interval(_ => {
            this.#update();
            this.#render();
        }, 1000 / 60);
    }

    stop() {
        if (this.#process) {
            this.#process.stop();
        }
    }

    resume() {
        if (this.#process) {
            this.#process.restart();
        }
    }

    #runCallback() {
        _ => {
            this.#update();
            this.#render();
        };
    }

    #update() {
        this.#forces.forEach(force => {
            this.#movers.forEach(mover => {
                mover.applyForce(force);
                mover.update();
            });
        });
    }

    #render() {
        this.#movers.forEach(mover => {
            mover.render(this.#svg);
        });
    }
}