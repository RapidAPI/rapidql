/**
 * Created by iddo on 7/13/17.
 */
"use strict";

class RenameNode {
    constructor(name, innerNode) {
        this.name = name;
        this.innerNode = innerNode;
    }

    getName() {
        return this.name;
    }

    eval(context, ops) {
        return this.innerNode.eval(context, ops);
    }
}

module.exports = RenameNode;