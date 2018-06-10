/**
 * Created by iddo on 12/20/16.
 */
"use strict";

const parser = require('./Parser/Parser'),
    RQLQuery = require('./RQLQuery');

class RQL {
    constructor(ops) {
        this.ops = ops;
        this.ops.logger = {
            log(msg) {
                if (ops.logLevel === 'info')
                    console.log(msg);
            }
        };
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

    log(queryString, context) {
        this.query(queryString, context).then((val) => {
            console.log(JSON.stringify(val, null, 2));
        }).catch((err) => {
            console.warn(err);
        })
    }
}

module.exports = RQL;