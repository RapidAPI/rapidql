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

    eval(context) {
        return new Promise((resolve, reject) => {
            this.innerNode.eval(context)
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