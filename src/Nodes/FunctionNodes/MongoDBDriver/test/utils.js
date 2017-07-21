/**
 * Created by iddo on 7/20/17.
 */
const assert = require('assert'),
    flattenObject = require('./../utils').flattenObject;


module.exports = () => {
    describe('flattenObject', () => {
        it('should not change one level object', () => {
            assert.deepEqual(flattenObject({a: 1, b: true, c: "asd"}), {a: 1, b: true, c: "asd"});
        });

        it('should flatten two level object', () => {
            assert.deepEqual(flattenObject({a: 1, b: true, c: "asd", o:{b:'c'}}), {a: 1, b: true, c: "asd", "o.b":'c'});
        });

        it('should flatten n level object', () => {
            assert.deepEqual(flattenObject({a: 1, b: true, c: "asd", o:{b:'c', d:{"c":"d"}}}), {a: 1, b: true, c: "asd", "o.b":'c', "o.d.c":"d" });
        });
    });
};