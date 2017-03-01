/**
 * Created by iddo on 3/1/17.
 */
const assert = require('assert'),
    LeafNode = require('../src/Nodes/LeafNode'),
    CompositeNode = require('../src/Nodes/CompositeNode'),
    FunctionNode = require('../src/Nodes/FunctionNode');

describe('Function Nodes', () => {
    describe('Recursive replace', () => {
        it('should replace a single constant', () => {
            assert.deepEqual(FunctionNode.recursiveReplace({a: '"b"'}, {}), {a:'b'});
        });

        it('should replace multiple constants', ()=> {
            assert.deepEqual(FunctionNode.recursiveReplace({a: '"b"', c: '"bbb"'}, {}), {a:'b', c:'bbb'});
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
    });
});