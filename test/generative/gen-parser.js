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

describe('Generative - Parser', () => {
    describe('Leaf Nodes', () => {
        check.it('should detect simple alpha-numeric leaf nodes that are un-quoted',{result: true, times: 50}, gen.array(gen.alphaNumString), async (leafs) => {
                // Filter out empty strings
                leafs = leafs.filter(a => a.length > 0);

                const queryString = `{
                    ${leafs.join(",\n")}
                }`;
                const val = await parse(queryString);

                assert.equal(val.length, leafs.length);

                for (let i = 0; i < leafs.length; i++) {
                    assert.equal(leafs[i], val[i].getName());
                }
        });

        check.it('should detect double-quoted freestyle ascii leaf nodes',{result: true, times: 50}, gen.array(gen.asciiString), async (leafs) => {
                leafs = leafs.map(a => a.replace(/"/g, ''));
                leafs = leafs.map(a => a.replace(/\\/g, ''));
                // Filter out empty strings
                leafs = leafs.filter(a => a.length > 0);

                const queryString = `{
                    ${leafs.map(l=> '"'+l+'"').join(",\n")}
                }`;
                const val = await parse(queryString);

                assert.equal(val.length, leafs.length);

                for (let i = 0; i < leafs.length; i++) {
                    assert.equal(leafs[i], val[i].getName());
                }
        });

        check.it('should detect single-quoted freestyle ascii leaf nodes',{result: true, times: 50}, gen.array(gen.asciiString), async (leafs) => {
            leafs = leafs.map(a => a.replace(/'/g, ''));
            leafs = leafs.map(a => a.replace(/\\/g, ''));
            leafs = leafs.map(a => a.replace(/ /g, ''));
            leafs = leafs.map(a => a.replace(/"/g, ''));
            // Filter out empty strings
            leafs = leafs.filter(a => a.length > 0);

            const queryString = `{
                    ${leafs.map(l=> '\''+l+'\'').join(",\n")}
                }`;
            const val = await parse(queryString);

            assert.equal(val.length, leafs.length);

            for (let i = 0; i < leafs.length; i++) {
                assert.equal(leafs[i], val[i].getName());
            }
        });
    });

    describe('Function Nodes', () => {
        check.it('accepts string parameters', {result: true, times: 50}, gen.asciiString, gen.asciiString, gen.alphaNumString, gen.alphaNumString, async (param1, param2, key1, key2) => {

            param1 = param1.replace(/'/g, '').replace(/\\/g, '').replace(/"/g, '');
            param2 = param2.replace(/'/g, '').replace(/\\/g, '').replace(/"/g, '');

            try {
                //make sure keys aren't empty
                key1 += (key1.length === 0) ? "a" : "";
                key2 += (key2.length === 0) ? "b" : "";

                const queryString = `{
                RapidAPI.Name.Function(${key1}:"${param1}", ${key2}:"${param2}") {
                    a
                }
            }`;
                const val = await parse(queryString);
                assert.equal(val.length, 1); // Exactly 1 root node
                assert.equal(val[0].hasOwnProperty('args'), true); // Check type. Only function nodes have args (it can be sub-type)
                assert.equal(val[0].args[key1], `"${param1}"`); //Check simple arg
                assert.equal(val[0].args[key2], `"${param2}"`); //Check simple arg
            } catch(e){
                console.log();
                console.log(e);
            }
        });
    });
});