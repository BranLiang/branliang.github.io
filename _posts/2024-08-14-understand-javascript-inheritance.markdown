---
layout: post
title:  "How does Javascript handles inheritance?"
date:   2024-08-14
categories: javascript
include_modules: [
    "/assets/js/inheritance/experiments.js",
]
---

I have been programming javascript for years and for sure I used the inheritance features from js. But what a shame that I still don't understand it. And I would like to understand it more by the end of this post.

By the way, this post is a notebook for the article [Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain), I am just trying to digest this article and spit it out again using my words.

### Why I need inherritance?

The answer is simple, I don't want to write the same code patterns again and again for similar usages. For example, in the previous post `nature of code using d3.js`. I created a bunch of chart and animations, they all share similar properties, like the container size.

### Walk through

> Each object has an internal link to another object called its prototype. That prototype object has a prototype of its own, and so on until an object is reached with null as its prototype.

The article's first paragraph contains above statement, which is really confusing to me. What is `internal link`? What is `prototype object` and a lot other `prototypes`? What? Let's figure it out.

> It is, for example, fairly trivial to build a classic model on top of a prototypal model — which is how classes are implemented.

Ok, TIL classes in javascript is just a special object and is a syntax sugar, for developer from traditional class-based languages.

```js
const o = {
    a: 1,
    b: 2,
    __proto__: {
        b: 3,
        c: 4
    }
}
console.log("a", o.a); // 1
console.log("b", o.b); // 2
console.log("c", o.c); // 4
console.log("o.[[Prototype]]", o.__proto__); // { b: 3, c: 4 }
console.log("o.[[Prototype]].[[Prototype]]", o.__proto__.__proto__); // {}
console.log("o.[[Prototype]].[[Prototype]].[[Prototype]]", o.__proto__.__proto__.__proto__); // null
```

Alright, looks like for javascript the property or method lookup chain follows the `__proto__` until `null`.

```js
const parent = {
    value: 2,
    get() {
        return this.value + 1;
    }
};

const child = {
    value: 1,
    __proto__: parent
};

console.log("child", child.get()); // 2
console.log("parent", parent.get()); // 3
```

Also, making a child object to inherite a parent object is as simple as setting the child `__proto__` property to the parent object.

### Constructors

```js
// Bad, too many duplicated logics
const boxes = [
  { value: 1, getValue() { return this.value; } },
  { value: 2, getValue() { return this.value; } },
  { value: 3, getValue() { return this.value; } },
];

// Better, but not the best
const boxPrototype = {
  getValue() {
    return this.value;
  },
};

const boxes = [
  { value: 1, __proto__: boxPrototype },
  { value: 2, __proto__: boxPrototype },
  { value: 3, __proto__: boxPrototype },
];

// Constructor! Best!
// A constructor function
function Box(value) {
  this.value = value;
}

// Properties all boxes created from the Box() constructor
// will have
Box.prototype.getValue = function () {
  return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
```

According to the code snippet above, it is clear that `class` in Javascript is of no special, it is just an object with some prototype methods. Clear!

```js
const object = { a: 1 };
console.log(Object.getPrototypeOf(object) === Object.prototype);

const array = [1, 2, 3];
console.log(Object.getPrototypeOf(array) === Array.prototype);

const regex = /abc/;
console.log(Object.getPrototypeOf(regex) === RegExp.prototype);
```

Now you know where all those builtin method of objects/arrays come from.

> Don't moneky patch the native prototypes from javascript, like adding your dummy methods to Array.prototype, this causes compatibility issue, and here is a good story - [SmooshGate](https://developer.chrome.com/blog/smooshgate/).

Also interesting, some native prototype has values! For example you can do this `Array.prototype.map(a => a + 1)`, but this is for historical reasons and it doesn't work for new native prototype and user defined constructors. Be careful!

```js
function Base() {}
function Derived() {}
Object.setPrototypeOf(Derived.prototype, Base.prototype);

// Is equal to

class Base {}
class Derived extends Base {}
```

One more thing I learned. Arrow function doesn't have a default prototype, means it doesn't inherit anything by default?

```js
const doSomethingFromArrowFunction = () => {};
console.log(doSomethingFromArrowFunction.prototype); // undefined
```

By the way, Safari doesn't log the prototypes very well, I am switching to Chrome to experiment the prototype stuff now.

(Done)







