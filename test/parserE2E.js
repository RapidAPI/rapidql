/**
 * Created by iddo on 7/13/17.
 */
"use strict";

const assert = require('assert'),
    LeafNode = require('../src/Nodes/LeafNode'),
    CompositeNode = require('../src/Nodes/CompositeNode'),
    RenameNode = require('../src/Nodes/RenameNode'),
    OptionalNode = require('../src/Nodes/OptionalNode'),
    FunctionNode = require('../src/Nodes/FunctionNode');


const parse = require('../src/Parser/Parser').parse;


describe('Parser E2E', () => {
    it('should match', async () => {
        let val = await parse(`
            {
                a
            }
            `);
        assert.deepEqual(val, [
            new LeafNode('a')
        ]);
    });

    it('should match', async () => {
        let val = await parse(`
            {
                a {
                    b,
                    c {
                        d
                    }
                }
            }
            `);
        assert.deepEqual(val, [
            new CompositeNode('a', [
                new LeafNode('b'),
                new CompositeNode('c', [
                    new LeafNode('d')
                ])
            ])
        ]);
    });

    it('should match', async () => {
        let val = await parse(`
            {
                ?a {
                    ll:b,
                    c {
                       ?er:d
                    }
                }
            }
            `);
        assert.deepEqual(val, [
            new OptionalNode(new CompositeNode('a', [
                new RenameNode('ll', new LeafNode('b')),
                new CompositeNode('c', [
                    new OptionalNode(new RenameNode('er', new LeafNode('d')))
                ])
            ]))
        ]);
    });
});