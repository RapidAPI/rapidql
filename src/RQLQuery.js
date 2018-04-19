/**
 * Created by Iddo on 12/17/2016.
 */
"use strict";

const ObjectNode = require('./Nodes/ObjectNode');

class WQLQuery {

    /**
     * Construct a new WQLQuery object from root nodes and context
     * @param roots array of root nodes
     * @param options any options required by query nodes
     */
    constructor(roots, options) {
        this.roots = roots;
        this.options = Object.assign({}, options);
    }

    //noinspection JSAnnotator
    /**
     * Performs the RQL query withing a specific context
     * @param context the context to perform the query in
     * @return Promise
     */
    async eval(context) {
        const queryNode = new ObjectNode('root', this.roots);
        return await queryNode.eval(context, this.options);
    }
}

module.exports = WQLQuery;