/**
 * Created by iddo on 3/1/17.
 */
const assert = require('assert'),
    LeafNode = require('../src/Nodes/LeafNode'),
    CompositeNode = require('../src/Nodes/CompositeNode'),
    FunctionNode = require('../src/Nodes/FunctionNode');

describe('Function Nodes', () => {

    describe('quoted', () => {
        it('should identify a string quoted with double quotes', ()=> {
            assert.deepEqual(FunctionNode.quoted('"asd"'), true);
        });

        it('should identify a string quoted with single quotes', ()=> {
            assert.deepEqual(FunctionNode.quoted("'aa'"), true);
        });

        it('should not identify a not quoted string', () => {
            assert.deepEqual(FunctionNode.quoted("asdfs"), false);
        });

        it('should not identify a partially quoted string', () => {
            assert.deepEqual(FunctionNode.quoted("'sdfsd"), false);
            assert.deepEqual(FunctionNode.quoted("sdfsd'"), false);
            assert.deepEqual(FunctionNode.quoted('"sdfsd'), false);
            assert.deepEqual(FunctionNode.quoted('"sdfsd'), false);
            assert.deepEqual(FunctionNode.quoted('sdfsdd"'), false);
        });
    });

    describe('removeQuotes', () => {
        it('should remove quotes', () => {
            assert.deepEqual(FunctionNode.removeQuotes('"asdasda"'), 'asdasda');
            assert.deepEqual(FunctionNode.removeQuotes("'asdasda'"), 'asdasda');
        });

        it('shouldnt change string with no quotes', () => {
            assert.deepEqual(FunctionNode.removeQuotes("asdasda"), 'asdasda');
        });

        it('should ignore single quote', () => {
            assert.deepEqual(FunctionNode.removeQuotes("'asdasda"), '\'asdasda');
            assert.deepEqual(FunctionNode.removeQuotes("\"asdasda"), '\"asdasda');
            assert.deepEqual(FunctionNode.removeQuotes("asdasda'"), 'asdasda\'');
            assert.deepEqual(FunctionNode.removeQuotes("asdasda\""), 'asdasda\"');
            assert.deepEqual(FunctionNode.removeQuotes("asdasda\"a"), 'asdasda\"a');
            assert.deepEqual(FunctionNode.removeQuotes("asdasda\'a"), 'asdasda\'a');
        });
    });

    describe('Recursive replace', () => {
        it('should replace a single constant string', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a: '"b"'}, {}), {a:'b'});
        });

        it('should replace multiple constants', ()=> {
            assert.deepEqual(FunctionNode.recursiveReplace({a: '"b"', c: '"bbb"', num:-5}, {}), {a:'b', c:'bbb', num:-5});
        });

        it('should replace a single constant number', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a: 123}, {}), {a:123});
        });

        it('should replace variables with context value', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a:'a'}, {a:2}), {a:2});
        });
        
        it('should properly handle mix of variables and constants', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a:'a', b:'"3"'}, {a:2}), {a:2, b:3});
        });

        it('should traverse down objects, replacing from the context tree', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({b:{a:'a'}}, {a:2}), {b:{a:2}});
        });

        it('should replace template (mustache templates)', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a:'"a={{a}}"'}, {a:2}), {a:"a=2"});
            assert.deepEqual(FunctionNode.recursiveReplace({a:'"{{a}}"'}, {a:2}), {a:"2"});
        });

        it('should handle deep referencing (dot notation) in objects', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a:'a.b'}, {a:{b:2}}), {a:2});
        });
    });
});