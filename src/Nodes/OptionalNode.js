/**
 * Created by iddo on 7/13/17.
 */
"use strict";

class OptionalNode {
    constructor(innerNode) {
        this.innerNode = innerNode;
    }

    getName() {
        return this.innerNode.getName();
    }

    //noinspection JSAnnotator
    eval(context, ops) {
        return new Promise((resolve, reject) => {
            this.innerNode.eval(context, ops)
                .then((val) => {
                    resolve(val);
                })
                .catch((err) => {
                    resolve(null);
                });
        });
    }
}

module.exports = OptionalNode;