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

    eval(context, ops) {
        const ctx = Object.assign({}, context, context[this.getName()]);
        let res = {};
        let promises = [];
        this.children.forEach((child) => {
            promises.push(new Promise((resolve, reject) => {
                child.eval(ctx, ops)
                    .then((val) => {
                        res[child.getName()] = val;
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

module.exports = ObjectNode;

//Playground:
/*const LeafNode = require("./LeafNode");
let context = {
    a: 1,
    b: {
        c:3,
        d:4
    }
};

let on = new ObjectNode("b", [
    new LeafNode("d"),
    new LeafNode("c")
]);

on.eval(context)
    .then((val) => {
        console.log(val);
    })
    .catch((error) => {
        console.warn(error);
    });
    */