/**
 * Created by Iddo on 12/17/2016.
 */

class LeafNode {
    constructor(name) {
        this.name = name;
    }

    name() {
        return this.name;
    }

    eval(context) {
        return context[this.name];
    }
}

module.exports = LeafNode;