/**
 * Created by Iddo on 12/17/2016.
 */
"use strict";

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
     * Performs the WQL query withing a specific context
     * @param context the context to perform the query in
     * @return Promise
     */
    eval(context) {
        let res = {};
        let promises = [];
        this.roots.forEach((root) => {
            promises.push(new Promise((resolve, reject) => {
                root.eval(context, this.options)
                    .then((val) => {
                        res[root.getName()] = val;
                        resolve();
                    })
                    .catch(reject);
            }));
        });
        return new Promise((resolve, reject) => {
            Promise.all(promises)
                .then(()=> {
                    resolve(res);
                })
                .catch(reject);
        });
    }
}

module.exports = WQLQuery;