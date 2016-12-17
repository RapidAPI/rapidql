/**
 * Created by Iddo on 12/17/2016.
 */

class WQLQuery {

    /**
     * Construct a new WQLQuery object from root nodes and context
     * @param roots array of root nodes
     */
    constructor(roots) {
        this.roots = roots;
    }

    /**
     * Performs the WQL query withing a specific context
     * @param context the context to perform the query in
     * @returns {{}} query result
     */
    eval(context) {
        let res = {};
        this.roots.forEach((root) => {
            res[root.name] = root.eval(context);
        });
        return res;
    }
}

module.exports = WQLQuery;