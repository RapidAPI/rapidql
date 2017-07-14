/**
 * Created by Iddo on 12/17/2016.
 */
"use strict";

class LeafNode {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    //noinspection JSAnnotator
    async eval(context) {
        if (context.hasOwnProperty(this.getName()))
            return context[this.getName()];
        else
            throw `Name ${this.getName()} does not exist in context ${context}`;
    }
}

module.exports = LeafNode;

//TEST PLAYGROUND
/*let context = {a:1};
let ln = new LeafNode("b");

ln.eval(context)
    .then((val) => {
        console.log(val);
    })
    .catch((error) => {
        console.warn(error);
    });

*/