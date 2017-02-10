/**
 * Created by iddo on 2/9/17.
 */
"use strict";

const assert = require('assert'),
    LeafNode = require('../src/Nodes/LeafNode'),
    CompositeNode = require('../src/Nodes/CompositeNode'),
    FunctionNode = require('../src/Nodes/FunctionNode');


const parse = require('../src/Parser/Parser').parse;

describe('Parser', () => {
    describe('Basics', () => {
        it('should return empty query', (done) => {
            parse(`{}`).then(val => {
                assert.deepEqual(val, []);
                done();
            }).catch(err => {
                done(`Resulted in error -> ${err}`);
            });
        });

        it('should reject empty string', (done) => {
            parse(``).then(val => {
                done(`Returned success with value - ${val}`);
            }).catch(err => {
                done();
            })
        });
    });

    it('should detect 1 leaf node', (done) => {
        parse(`{
            a
        }`).then((val) => {
            let n = val[0];
            assert.equal(val.length, 1); // Only 1 node
            assert.equal(n instanceof LeafNode, true); // Leaf node
            assert.equal(n.getName(), 'a'); //Name is a
            done();
        }).catch((err) => {
            done(`Rejected with error ${err}`);
        });
    });

    it('should detect 2 leaf nodes', (done) => {
        parse(`{
            b,
            c
        }`).then((val) => {
            assert.equal(val.length, 2); // Exactly 2 nodes

            //Node 1
            assert.equal(val[0] instanceof LeafNode, true); // Leaf node
            assert.equal(val[0].getName(), 'b'); //Name is b

            //Node 2
            assert.equal(val[1] instanceof LeafNode, true); // Leaf node
            assert.equal(val[1].getName(), 'c'); //Name is b

            done();
        }).catch((err) => {
            done(`Rejected with error ${err}`);
        });
    });

    it('should support composite nodes', (done) => {
        parse(`{
            a {
                b
            }
        }`).then((val) => {
            assert.equal(val.length, 1); // Exactly 1 root node

            assert.equal(val[0] instanceof CompositeNode, true); // Root node is composite node
            assert.equal(val[0].getName(), 'a'); // Root node's name is a

            assert.equal(val[0].children.length, 1); // Has one child
            assert.equal(val[0].children[0].getName(), 'b'); // Child name is b
            assert.equal(val[0].children[0] instanceof LeafNode, true); // Child is a leaf node

            done();

        }).catch((err) => {
            done(`Rejected with error ${err}`);
        });
    });

    it('should support function nodes', (done) => {
        parse(`{
            DataSource.Name.Function(key1:val1, key2:{subKey: subValue}) {
                a
            }
        }`).then((val) => {
            assert.equal(val.length, 1); // Exactly 1 root node

            assert.equal(val[0].hasOwnProperty('args'), true); // Check type. Only function nodes have args (it can be sub-type)
            assert.equal(val[0].getName(), 'DataSource.Name.Function'); // Root node's name is DataSource.Name.Function

            assert.equal(val[0].args['key1'], "val1"); //Check simple arg
            assert.deepEqual(val[0].args['key2'], {subKey: "subValue"}); //Check complex arg

            assert.equal(val[0].children.length, 1); // Has one child
            assert.equal(val[0].children[0].getName(), 'a'); // Child name is a
            assert.equal(val[0].children[0] instanceof LeafNode, true); // Child is a leaf node

            done();

        }).catch((err) => {
            done(`Rejected with error ${err}`);
        });
    });
});