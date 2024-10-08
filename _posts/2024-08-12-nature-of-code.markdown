---
layout: post
title:  "Nature of Code with d3.js"
date:   2024-08-12
categories: js
include_scripts: [
    "https://cdn.jsdelivr.net/npm/d3@7",
    "/assets/js/perlin.js",
    "/assets/js/victor.min.js"
]
include_modules: [
    "/assets/js/nature_of_code/warmup.js",
    "/assets/js/nature_of_code/0-1-random-walker.js",
    "/assets/js/nature_of_code/0-2-random-distribution.js",
    "/assets/js/nature_of_code/0-3-gaussian-distribution.js",
    "/assets/js/nature_of_code/0-4-perlin-noise.js",
    "/assets/js/nature_of_code/1-1-bouncing-ball.js",
    "/assets/js/nature_of_code/1-2-vector-subtraction.js",
    "/assets/js/nature_of_code/1-3-vector-magnitude.js",
    "/assets/js/nature_of_code/1-4-forces.js"
]
---

This post is a personal follow up to the book [The nature of code](https://natureofcode.com). Instead of using [p5.js](https://p5js.org) from the book, I decide to use [d3.js](https://d3js.org), as just copying the code from the book is of no fun and `d3.js` is more popular among web developers. However, I have never developed anything using d3.js before, so let's see how far I can go this time!

### Warm up exercise

First of all, let me put up a simple diagram to make sure this is working in this blog.

<div 
  id='noc-warmup'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Here I encountered first problem, the inner svg doesn't have the same width and height as the outer container, after a bit exploration, I used the following solution, which simply get the container size using `offsetWidth` and `offsetHeight`, and set them as the inner svg `attr`.

```js
const container = document.getElementById("noc-warmup");

const svg = d3.select("#noc-warmup").append("svg")
    .attr("width", container.offsetWidth)
    .attr("height", container.offsetHeight)
```

### Random walker

Next is a simple illustration of a random walker, who will start from the center of the canvas and randomly walking on it.

<div 
  id='noc-random-walker'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

### Random number distribution

It is said the js `Math.random` is uniformly distributed, is that true? Let's find out by building a distribution graph.

<div 
  id='noc-random-distribution'
  style='height:480px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Wow, I didn't expect the bar chart to be so hard to generate, but still I did it, and compared with before, when I always use some kind of third party chart library to draw all kind of chart, now this is a whole new level of char drawing, I am using d3.js to manipulate the svg element directly now.

The most tricky part of this diagram is the way to link to the data. I am not fully understand what's happening there yet, but generally speaking, the dynamic chart uses to steps `enter` and `merge` to make the bar chart dynamic.

Check this [article](https://bost.ocks.org/mike/join/) if you are confused as myself.

```js
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
```

### Gaussian distribution

Uniform distribution is uncommon in the nature, so let's taste a bit about the Gaussian distribution, also known as the normal distribution.

<div 
  id='noc-gaussian-distribution'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Sometimes, even gaussian distribution is not natural enough, in that case, we could try using the `Perlin noise`, following I will compare the perlin noise with the uniform random numbers side by side.

<div
    style='width:100%; margin-bottom:10px; display:flex; justify-content:space-between;'
>
    <div 
        id='noc-compare-perlin-noise'
        style='height:240px; width:48%; border:1px solid gray;'
    >
    </div>
    <div 
        id='noc-compare-random-noise'
        style='height:240px; width:48%; border:1px solid gray;'
    >
    </div>
</div>

It is clear that perlin noise looks much natural than uniform random noise.

### Bouncing ball

Next chapter, let's talk about vectors!

<div 
  id='noc-compare-bouncing-ball'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Initially, I was using the approach which removes the object first and then redraw the whole object again in a new position, but this feels laggy and compared with the animation from `p5.js`, my version looks worse.

```js
svg.selectAll("*").remove();

svg.append("circle")
    .attr("cx", x)
    .attr("cy", y)
    .attr("r", 48)
    .attr("fill", "steelblue");
```

According to the documentation, the correct way should use the d3 events like `enter`, `update`. Let's update the script now!

```js
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
```

New update approach does feel a bit more smooth, not sure if that's just an illusion.

As an upgrade, the book asks to use vector instead of using the naive `x` and `y` values, however it seems that d3.js doesn't offer native vector calculation support, any other libraries I can turn to this time? It turns out that there is actually one library [vistor.js](http://victorjs.org) that does the vector calculation job. I will try to use the victor library for the following tasks, I really don't want to create my own vector math library XD.

### Vector subtraction

For this demonstration, I need to figure out how to dynamically update the graph based on my mouse position.

<div
  id='noc-vector-subtraction'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Unlike the code with p5.js, I didn't use the vector subtraction function, as I don't find a place to use that function.

### Vector magnitude

<div
  id='noc-vector-magnitude'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

Until now, I have already created a bunch of small svg based animations, if you check the js source code, you will find that compared with the p5.js source code, the code with d3.js is much longer and hard to read, that's because I am using a much lower level of API than the one provided from p5.js, but that should could be optimized if I created a few helpers and abstractions, so let's create a mini engine (helpers) now!

### Forces

<div
  id='noc-forces'
  style='height:240px; width:100%; border:1px solid gray; margin-bottom:10px;'
>
</div>

This diagram tricked me for a while, as I find it really tricky to apply gravity force using the native `force` API, and also I need to set the velocity delay to zero, otherwise the velocity increase drops very quickly.

As the codebase using d3.js is much harder than using p5.js alone I find it difficult to follow using d3.js alone. Therefore I am going to switch to using p5.js Now.

(Done)