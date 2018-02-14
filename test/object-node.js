/**
 * Created by iddo on 2/13/18.
 */

const chai = require("chai");
chai.use(require("chai-as-promised"));
const { expect, assert } = chai;
const { describe, it } = require('mocha');
const ObjectNode = require('../src/Nodes/ObjectNode');
const LeafNode = require('../src/Nodes/LeafNode');

describe('ObjectNode', () => {
  it('should throw error if element is not an object', async () => {
    let n = new ObjectNode('obj', []);

    await expect(n.eval({'obj' : 1})).to.be.rejectedWith('TypeError: element obj in context is not an object');
  });

  it('should handle valid objects properly', async () => {
      let n = new ObjectNode('obj', [
        new LeafNode('a'),
        new LeafNode('b')
      ]);

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
    let n = new ObjectNode('obj', [
      new LeafNode('a'),
      new LeafNode('b')
    ]);

    let v = await n.eval({
      obj: {
        a: 'AA'
      },
      b: 'BB'
    });

    assert.equal(v.a, 'AA');
    assert.equal(v.b, 'BB');
  });
});

