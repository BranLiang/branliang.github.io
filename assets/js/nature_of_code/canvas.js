export default class SvgContainer {
    constructor(id) {
        this.container = document.getElementById(id);
        this.svg = d3.select(`#${id}`).append("svg")
            .attr("width", this.container.offsetWidth)
            .attr("height", this.container.offsetHeight);
    }
}