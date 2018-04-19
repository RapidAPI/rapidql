/**
 * Created by iddo on 4/19/18.
 */
"use strict";
const utils = require('./utils');

class FlatObjectNode {
    constructor(innerNode) {
        this.innerNode = innerNode;
    }

    getName() {
        return this.innerNode.getName();
    }

    //noinspection JSAnnotator
    async eval(context, ops) {
        return await this.innerNode.eval(context, ops);
    }
}

module.exports = FlatObjectNode;