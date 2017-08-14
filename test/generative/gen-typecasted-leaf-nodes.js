/**
 * Created by iddo on 7/27/17.
 */
"use strict";

const { describe, it } = require('mocha');
const { check, gen } = require('mocha-testcheck');
const { expect, assert } = require('chai');
require('mocha-testcheck').install();

const LeafNode = require('../../src/Nodes/LeafNode'),
    CompositeNode = require('../../src/Nodes/CompositeNode'),
    RenameNode = require('../../src/Nodes/RenameNode'),
    OptionalNode = require('../../src/Nodes/OptionalNode'),
    CastedLeafNode = require('../../src/Nodes/CastedLeafNode'),
    FunctionNode = require('../../src/Nodes/FunctionNode');

const parse = require('../../src/Parser/Parser').parse;

describe('Generative - CastedLeafNode.typeConverters', () => {
    describe('int', () => {
        const converter = CastedLeafNode.typeConverters.int;

        check.it('should return ints as ints', gen.int, (i) => {
            assert.equal(converter(i),i);
        });

        check.it('should return floats as ints', gen.numberWithin(-100000, 100000), (i) => {
            assert.equal(converter(i), parseInt(i));
        });

        check.it('should parse strings as ints', gen.int, (i) => {
            assert.equal(converter(`${i}`),i);
        });
    });

    describe('float', () => {
        const converter = CastedLeafNode.typeConverters.float;

        check.it('should return floats as floats', gen.numberWithin(-100000, 100000), (i) => {
            assert.equal(converter(i),i);
        });

        check.it('should parse strings as floats', gen.numberWithin(-100000, 100000), (i) => {
            assert.equal(converter(`${i}`),i);
        });
    });
});