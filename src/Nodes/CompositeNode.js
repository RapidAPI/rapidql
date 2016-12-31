/**
 * Created by iddo on 12/19/16.
 */
"use strict";
const ObjectNode = require('./ObjectNode');
const ArrayNode = require('./ArrayNode');

class CompositeNode {
    constructor(name, children) {
        this.name = name;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    eval(context, ops) {
        if(Array.isArray(context[this.getName()])) {
            return (new ArrayNode(this.getName(), this.children)).eval(context, ops);
        } else {
            return (new ObjectNode(this.getName(), this.children)).eval(context, ops);
        }
    }
}

module.exports = CompositeNode;