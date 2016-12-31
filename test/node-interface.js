/**
 * Created by iddo on 12/30/16.
 */
"use strict";

/**
 * Tests all nodes to make sure that they are coherent with the interface:
 *      - Construct with name
 *      - Get name and make sure it is equal
 *      - Eval is a function returning a promise
 */

const assert = require('assert');

const NodeTypes = [
    `ArrayNode`,
    `CompositeNode`,
    `FunctionNode`,
    `LeafNode`,
    `ObjectNode`
];

describe(`Node interfaces`, () => {

    NodeTypes.forEach((NodeType) => {
        describe(`Node - ${NodeType}`, () => {
            const NodeClass = require(`../src/Nodes/${NodeType}`);
            const _name = 'a.a',
                _children = [],
                _args = {};
            const node = new NodeClass(_name, _children, _args);

            it('should return name properly', () => {
                assert.equal(_name, node.getName());
            });

            describe('eval function', () => {
                it('should have an eval() function', () => {
                    assert.equal('function', typeof node.eval)
                });

                it(`should return a promise when called`, () => {
                    let p = node.eval({}, {});
                    assert.equal(true, (Promise.resolve(p) == p)); //http://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199
                });
            });
        });
    });

});