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

function Box(value) {
    this.value = value;
}

// Properties all boxes created from the Box() constructor
// will have
Box.prototype.getValue = function () {
    return this.value;
};

const boxes = [new Box(1), new Box(2), new Box(3)];
console.log(boxes[0]); // Box { value: 1, getValue: [Function] }

const object = { a: 1 };
console.log(Object.getPrototypeOf(object) === Object.prototype);

const array = [1, 2, 3];
console.log(Object.getPrototypeOf(array) === Array.prototype);

const regex = /abc/;
console.log(Object.getPrototypeOf(regex) === RegExp.prototype);