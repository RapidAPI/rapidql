/**
 * Created by iddo on 12/20/16.
 */
"use strict";

const parser = require('./Parser/Parser'),
    RQLQuery = require('./RQLQuery');

class RQL {
    constructor(ops) {
        this.ops = ops;
    }

    query(queryString, context) {
        if(!context) context = {};
        return new Promise((resolve, reject) => {
            parser.parse(queryString)
                .catch(reject)
                .then((queryRoots) => {
                    let queryObject = new RQLQuery(queryRoots, this.ops);
                    queryObject.eval(context).then(resolve).catch(reject);
                })
        });
    }
}

module.exports = RQL;