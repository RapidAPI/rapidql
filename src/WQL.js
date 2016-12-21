/**
 * Created by iddo on 12/20/16.
 */

const parser = require('./Parser/Parser'),
    WQLQuery = require('./WQLQuery');

class WQL {
    constructor(ops) {
        this.ops = ops;
    }

    query(queryString, context) {
        if(!context) context = {};
        return new Promise((resolve, reject) => {
            parser.parse(queryString)
                .catch(reject)
                .then((queryRoots) => {
                    let queryObject = new WQLQuery(queryRoots, this.ops);
                    queryObject.eval(context).then(resolve).catch(reject);
                })
        });
    }
}

module.exports = WQL;