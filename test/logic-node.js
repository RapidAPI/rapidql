/**
 * Created by iddo on 9/25/18.
 */
"use strict";

const {assert} = require('chai');
const { describe, it } = require('mocha');
const LeafNode = require("../src/Nodes/LeafNode");
const LogicNode = require("../src/Nodes/LogicNode");

describe("LogicNode", () => {
    let _context = {
        a: "aaa",
        b: "bbb",
        c: 10,
        d: 5,
        obj: {
            aaa: "aaa"
        }
    };

    describe ("__if logic", () => {
        const __if = LogicNode.logicFunctions.if;
        const prettyIf = (val1, val2, comparison) => __if({val1,val2,comparison});

        describe("==", () => {
            it ("should use comparison by default", () => {
                assert.isOk(prettyIf("aa","aa"));
                assert.isNotOk(prettyIf("aa","bb"));
            });

            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("aa","aa", "=="));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("aa","abba", "=="));
            });
        });

        describe("!=", () => {
            let comp = "!=";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("aa","bb", comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("aa","aa", comp));
            });
        });

        describe(">", () => {
            let comp = ">";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf(5,3, comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf(4,83, comp));
            });
        });

        describe(">=", () => {
            let comp = ">=";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf(5,3, comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf(4,83, comp));
            });
        });

        describe("<", () => {
            let comp = "<";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf(3,35, comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf(48,8, comp));
            });
        });

        describe("<=", () => {
            let comp = "<=";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf(3,35, comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf(48,8, comp));
            });
        });

        describe("prefixes", () => {
            let comp = "prefixes";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("+1","+14158496404", comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("+972","+14158496404", comp));
            });
        });

        describe("in", () => {
            let comp = "in";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("+1",["+1","+2","+3"], comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("+4",["+1","+2","+3"], comp));
            });
        });

        describe("notIn", () => {
            let comp = "notIn";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("+4",["+1","+2","+3"], comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("+1",["+1","+2","+3"], comp));
            });
        });

        describe("prefixIn", () => {
            let comp = "prefixIn";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("+14158496404",["+1","+2","+3"], comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("+972544266822",["+1","+2","+3"], comp));
            });
        });

        describe("prefixNotIn", () => {
            let comp = "prefixNotIn";
            it ("should return true on positive comparison", () => {
                assert.isOk(prettyIf("+972544266822",["+1","+2","+3"], comp));
            });

            it ("should return false on negative comparison", () => {
                assert.isNotOk(prettyIf("+14158496404",["+1","+2","+3"], comp));
            });
        });
    });

    describe("general behaviour", () => {


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

    describe("follow on nodes (elseif, else)", () => {
        it ("should not run @else node if @if node is true", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"aaa"'
            }, new LogicNode( "else.", [
                new LeafNode('b')
            ], {

            }));

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {a: "aaa"});
        });

        it ("should default to @else node if @if node is false", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"bbb"'
            }, new LogicNode( "else.", [
                new LeafNode('b')
            ], {

            }));

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {b: "bbb"});
        });

        it ("should default to @elseif node if @if node is false and @elseif is true", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"bbb"'
            }, new LogicNode( "elseif.", [
                new LeafNode('b')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"aaa"'
            }, new LogicNode( "else.", [
                new LeafNode('c')
            ], {

            })));

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {b: "bbb"});
        });

        it ("should default to @else node if @if node is false and @else is false", async () => {
            let ln = new LogicNode("if.", [
                new LeafNode('a')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"bbb"'
            }, new LogicNode( "elseif.", [
                new LeafNode('b')
            ], {
                comparison: '"=="',
                val1: '"aaa"',
                val2: '"bbb"'
            }, new LogicNode( "else.", [
                new LeafNode('c')
            ], {

            })));

            let res = await ln.eval(_context, {});
            assert.deepEqual(res,  {c: 10});
        });
    });

});