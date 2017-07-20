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
    
    //noinspection JSAnnotator
    eval(context, ops) {
        if (this.children.length === 0) {
            // If object has no children, append all
            return new Promise((resolve, reject) => {
                resolve(context[this.getName()]);
            });
        }
        else if(Array.isArray(context[this.getName()])) {
            return (new ArrayNode(this.getName(), this.children)).eval(context, ops);
        } else {
            return (new ObjectNode(this.getName(), this.children)).eval(context, ops);
        }
    }
}

module.exports = CompositeNode;