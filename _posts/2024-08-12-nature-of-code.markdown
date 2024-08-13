---
layout: post
title:  "Nature of Code with d3.js"
date:   2024-08-12
categories: js
include_scripts: [
    "https://cdn.jsdelivr.net/npm/d3@7"
]
include_modules: [
    "/assets/js/nature_of_code/warmup.js"
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
