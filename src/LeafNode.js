/**
 * Created by Iddo on 12/17/2016.
 */

class LeafNode {
    constructor(name) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    eval(context) {
        return context[this.getName()];
    }
}

module.exports = LeafNode;