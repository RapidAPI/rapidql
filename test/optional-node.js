/**
 * Created by iddo on 7/13/17.
 */

"use strict";

const assert = require("assert");
const LeafNode = require("../src/Nodes/LeafNode");
const OptionalNode = require("../src/Nodes/OptionalNode");
const CompositeNode = require("../src/Nodes/CompositeNode");

describe("OptionalNode", () => {
    const node = new OptionalNode(new LeafNode("a"));
    describe('eval function', () => {
        it('should have an eval() function', () => {
            assert.equal('function', typeof node.eval)
        });

        it(`should return a promise when called`, () => {
            let p = node.eval({}, {});
            assert.equal(true, (Promise.resolve(p) == p)); //http://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199
        });
    });

    it('should return correct name', () => {
        assert.equal(node.getName(), "a");
    });

    it('should return value on success', async () => {
        const res = await node.eval({a:"bbb"});
        assert.equal(res, "bbb");
    });

    it('should return null on rejection', async () => {
        const res = await node.eval({});
        assert.equal(res, null);
    });

    it('should return null on rejection in children', async () => {
        const compNode = new OptionalNode(new CompositeNode('a', [
            new LeafNode('d')
        ]));
        const res = await compNode.eval({
            a: {b:1}
        });
        assert.equal(res, null);
    });
});