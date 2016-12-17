/**
 * Created by Iddo on 12/17/2016.
 */

class ObjectNode {
    constructor(name, children) {
        this.name = name;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    eval(context) {
        const ctx = Object.assign({}, context, context[this.name]);
        let res = {};
        this.children.forEach((child) => {
             res[child.getName()] = child.eval(ctx);
        });
        return res;
    }
}

module.exports = ObjectNode;