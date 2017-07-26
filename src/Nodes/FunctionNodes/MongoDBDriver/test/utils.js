/**
 * Created by iddo on 7/20/17.
 */
const assert = require('assert'),
    flattenObject = require('./../utils').flattenObject,
    reducers = require('./../utils').reducers;


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

    describe('reducers - aggregate', () => {
        describe('avg', () => {
            const avg = reducers.avg;
            it ('should average ints', () => {
                assert.equal(avg([1,2,3]), 2);
            });
            it ('should average floats', () => {
                assert.equal(avg([1.75,1.5,1.25]), 1.5);
            });
            it ('should parse strings to ints', () => {
                assert.equal(avg([0.5,"2","3.5"]), 2);
            });
            it ('should support negative numbers', () => {
                assert.equal(avg([2,"0","-2"]), 0);
            });
        });

        describe('max', () => {
            const max = reducers.max;
            it ('should support ints', () => {
                assert.equal(max([1,2,3]), 3);
            });
            it ('should support floats', () => {
                assert.equal(max([1.75,1.5,1.25]), 1.75);
            });
            it ('should parse strings to ints', () => {
                assert.equal(max([0.5,"2","3.5"]), 3.5);
            });
            it ('should support negative numbers', () => {
                assert.equal(max([-4,"-1","-2"]), -1);
            });
        });

        describe('min', () => {
            const min = reducers.min;
            it ('should support ints', () => {
                assert.equal(min([1,2,3]), 1);
            });
            it ('should support floats', () => {
                assert.equal(min([1.75,1.5,1.25]), 1.25);
            });
            it ('should parse strings to ints', () => {
                assert.equal(min(["0.5","2","3.5"]), 0.5);
            });
            it ('should support negative numbers', () => {
                assert.equal(min([-4,"-1","-2"]), -4);
            });
        });

        describe('sum', () => {
            const sum = reducers.sum;
            it ('should support ints', () => {
                assert.equal(sum([1,2,3]), 6);
            });
            it ('should support floats', () => {
                assert.equal(sum([1.75,1.5,1.25]), 4.5);
            });
            it ('should parse strings to ints', () => {
                assert.equal(sum(["0.5","2","3.5"]), 6);
            });
            it ('should support negative numbers', () => {
                assert.equal(sum([-4,"-1","-2"]), -7);
            });
        });

    });
};