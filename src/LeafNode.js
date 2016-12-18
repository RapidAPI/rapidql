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
        return new Promise((resolve, reject) => {
            if (context.hasOwnProperty(this.getName()))
                resolve(context[this.getName()]);
            else
                reject(`Name ${this.getName()} does not exist in context ${context}`)
        });
    }
}

module.exports = LeafNode;

//TEST PLAYGROUND
/*let context = {a:1};
let ln = new LeafNode("b");

ln.eval(context)
    .then((val) => {
        console.log(val);
    })
    .catch((error) => {
        console.warn(error);
    });

*/