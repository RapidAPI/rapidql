/**
 * Created by iddo on 4/19/18.
 */
const chai = require("chai");
chai.use(require("chai-as-promised"));
const { expect, assert } = chai;
const { describe, it } = require('mocha');
const ObjectNode = require('../src/Nodes/ObjectNode');
const FlatObjectNode = require('../src/Nodes/FlatObjectNode');
const LeafNode = require('../src/Nodes/LeafNode');

describe('ObjectNode', () => {

    it('should handle valid objects properly', async () => {
        let n = new FlatObjectNode (new ObjectNode('obj', [
            new LeafNode('a'),
            new LeafNode('b')
        ]));

        let v = await n.eval({
            obj: {
                a: 'AA',
                b: 'BB'
            }
        });

        assert.equal(v.a, 'AA');
        assert.equal(v.b, 'BB');
    });

    it('should support referencing properties from outside object within object', async () => {
        let n = new FlatObjectNode (new ObjectNode('obj', [
            new LeafNode('a'),
            new LeafNode('b')
        ]));

        let v = await n.eval({
            obj: {
                a: 'AA'
            },
            b: 'BB'
        });

        assert.equal(v.a, 'AA');
        assert.equal(v.b, 'BB');
    });

    it('should be flat (aka show as properties vs as object) when placed in Object Node', async () => {
        let n = new ObjectNode('root', [
            new FlatObjectNode (new ObjectNode('obj', [
                new LeafNode('a'),
                new LeafNode('b')
            ]))
        ]);

        let v = await n.eval({
            root: {
                obj: {
                    a: 'AA',
                    b: 'BB'
                }
            }
        });

        assert.deepEqual(v, {
            a: 'AA',
            b: 'BB'
        });
    });
});

