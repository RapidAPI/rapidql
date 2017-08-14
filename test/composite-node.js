/**
 * Created by iddo on 7/28/17.
 */

const {assert} = require('chai');
const { describe, it } = require('mocha');
const ArrayNode = require('../src/Nodes/ArrayNode');
const CompositeNode = require('../src/Nodes/CompositeNode');
const LeafNode = require('../src/Nodes/LeafNode');

describe("CompositeNode", () => {
    it('should throw an error if object is not an array / object', (done) => {
        let n = new CompositeNode('arr', []);
        n.eval({arr: "asd"}, {})
            .then(() => {
                done('Should have thrown an error');
            })
            .catch((err) => {
                done();
            });
    });

    it('should throw an error if object is not in context', (done) => {
        let n = new CompositeNode('arr', []);
        n.eval({}, {})
            .then(() => {
                done('Should have thrown an error');
            })
            .catch((err) => {
                done();
            });
    });

    it('should materialize into array - implicit', async () => {
        let n = new CompositeNode('arr', []);
        let arr = ["aa", "bb", "cc"];
        let res = await n.eval({arr:arr}, {});
        assert.deepEqual(res, arr);
    });

    it('should materialize into array - explicit', async () => {
        let n = new CompositeNode('arr', [
            new LeafNode('a')
        ]);
        let arr = [{a:1}, {a:2}, {a:3}];
        let res = await n.eval({arr:arr}, {});
        assert.deepEqual(res, arr);
    });

    it('should materialize into object - implicit', async () => {
        let n = new CompositeNode('obj', []);
        let obj = {a:'aa', b:'bb'};
        let res = await n.eval({obj: obj}, {});
        assert.deepEqual(res, obj);
    });

    it('should materialize into object - implicit', async () => {
        let n = new CompositeNode('obj', [
            new LeafNode('a'),
            new LeafNode('b')
        ]);
        let obj = {a:'aa', b:'bb'};
        let res = await n.eval({obj: obj}, {});
        assert.deepEqual(res, obj);
    });
});