/**
 * Created by iddo on 7/13/17.
 */
"use strict";

const assert = require("assert");
const LeafNode = require("../src/Nodes/LeafNode");
const RenameNode = require("../src/Nodes/RenameNode");
const CompositeNode = require("../src/Nodes/CompositeNode");

describe("RenameNode", () => {
    const node = new RenameNode("b", new LeafNode("a"));

    describe('eval function', () => {
        it('should have an eval() function', () => {
            assert.equal('function', typeof node.eval)
        });

        it(`should return a promise when called`, () => {
            let p = node.eval({a:1});
            assert.equal(true, (Promise.resolve(p) == p)); //http://stackoverflow.com/questions/27746304/how-do-i-tell-if-an-object-is-a-promise/38339199#38339199
        });
    });

    it('should return correct name', () => {
        assert.equal(node.getName(), "b");
    });

    it('should return correct value', async () => {
        const res = await node.eval({a:1});
        assert.deepEqual(res, 1);
    });
});