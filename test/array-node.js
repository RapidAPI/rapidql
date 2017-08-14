/**
 * Created by iddo on 7/28/17.
 */

const {assert} = require('chai');
const { describe, it } = require('mocha');
const ArrayNode = require('../src/Nodes/ArrayNode');
const LeafNode = require('../src/Nodes/LeafNode');

describe("ArrayNode", () => {
    it('should throw an error if object is not an array', (done) => {
        let n = new ArrayNode('arr', []);
        n.eval({arr: "asd"}, {})
            .then(() => {
                done('Should have thrown an error');
            })
            .catch(() => {
                done();
            });
    });

    it('should throw an error if object is not in context', (done) => {
        let n = new ArrayNode('arr', []);
        n.eval({}, {})
            .then(() => {
                done('Should have thrown an error');
            })
            .catch(() => {
                done();
            });
    });

    it('should support object array', async () => {
        let n = new ArrayNode('arr', [
            new LeafNode('a')
        ]);
        let arr = [{a:1}, {a:2}, {a:3}];
        let res = await n.eval({arr:arr}, {});
        assert.deepEqual(res, arr);
    });

    it('should support string array - explicit', async () => {
        let n = new ArrayNode('arr', [
            new LeafNode('arr')
        ]);
        let arr = ["aa", "bb", "cc"];
        let res = await n.eval({arr:arr}, {});
        assert.deepEqual(res, [{arr:'aa'},{arr:'bb'},{arr:'cc'}]);
    });

    it('should support string array - implicit', async () => {
        let n = new ArrayNode('arr', []);
        let arr = ["aa", "bb", "cc"];
        let res = await n.eval({arr:arr}, {});
        assert.deepEqual(res, arr);
    });
});