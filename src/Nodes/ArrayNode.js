/**
 * Created by iddo on 12/19/16.
 */
"use strict";
const ObjectNode = require('./ObjectNode');
const LeafNode = require('./LeafNode');
const { createMixedContext } = require('./utils');

class ArrayNode {
    constructor(name, children) {
        this.name = name;
        this.children = children;
    }
    
    getName() {
        return this.name;
    }

    //noinspection JSAnnotator
    eval(context, ops) {
            let arr = context[this.getName()];
            let promises = [];
            if (!Array.isArray(arr)) {
                return Promise.reject(`TypeError: element ${this.getName()} in context is not an array`);
            } else {

                for (let i in arr) {
                    /**
                     * If iterating over array of objects, inner context is the object in the array.
                     * If iterating over array of scalars ([s]), inner context is the object {[this.name]:s}
                     */
                    let obj = arr[i];

                    let innerContext;

                    let innerNode;
                    if(typeof obj === "object") {
                        innerContext  = createMixedContext(context, {
                            [this.getName()] : obj
                        });
                        innerNode = new ObjectNode(this.getName(), this.children);
                    } else if (this.children.length > 0) {
                        innerContext  = createMixedContext(context, {
                            [this.getName()] : {
                                [this.getName()] : obj
                            }
                        });
                        innerNode = new ObjectNode(this.getName(), this.children);
                    } else {
                        innerContext  = createMixedContext(context, {
                            [this.getName()] : obj
                        });
                        innerNode = new LeafNode(this.getName());
                    }
                    promises.push(innerNode.eval(innerContext, ops));
                }

                return Promise.all(promises);
            }

        
    }
}

module.exports = ArrayNode;