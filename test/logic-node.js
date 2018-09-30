/**
 * Created by iddo on 9/25/18.
 */
"use strict";

const {assert} = require('chai');
const { describe, it } = require('mocha');
const LeafNode = require("../src/Nodes/LeafNode");
const LogicNode = require("../src/Nodes/LogicNode");

describe("LogicNode", () => {

    describe("general behaviour", () => {
        let _context = {
            a: "aaa",
            b: "bbb",
            c: 10,
            d: 5,
            obj: {
                aaa: "aaa"
            }
        };

        it ("should return null when condition is false", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"bbb"'
            });

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  null);
        });

        it ("should return inner object when evaluation is true", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"aaa"'
            });

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {a: "aaa"});
        });

        it ("should use variable data for comparison as well as literals", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: 'a'
            });

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {a: "aaa"});
        });

        it ("should support variable data from deep object for comparison", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: 'obj.aaa',
                val2: 'a'
            });

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {a: "aaa"});
        });

    });

});