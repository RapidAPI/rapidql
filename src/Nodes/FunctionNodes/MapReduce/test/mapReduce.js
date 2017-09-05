/**
 * Created by iddo on 8/31/17.
 */
const { expect, assert } = require('chai');
const {mapReduce, scatterStep, reduceStep, mapStep} = require('./../mapReduce');
const identityFunction = a => a;

module.exports = () => {
    describe('Map Reduce Logic', () => {
        describe('Map Step', () => {
            it ('Should support empty arrays', () => {
                assert.deepEqual([], mapStep([], identityFunction));
            });

            it('shouldnt change array by mapping to identity function', () => {
                let arr = ['avc', {a:1}, 13, null, undefined, 0];
                assert.deepEqual(arr, mapStep(arr, identityFunction));
            });

            /**
             * Checks that it actually performs function enough times
             */
            it('should perform map function for each item', () => {
                let count = 0;
                function inc (a) {
                    count += a;
                }
                let arr = [1,2,3];

                mapStep(arr, inc);

                assert.deepEqual(6, count);

            });

            it('should return mapped array', () => {
                let arr = ["a", "b", "c"];
                function map(a) {
                    return a+a;
                }
                assert.deepEqual(mapStep(arr, map), ["aa", "bb", "cc"]);
            });

            it('should flatten arrays', () => {
                let arr = ["a", "b", "c"];
                function map(a) {
                    return [a+a, a+a];
                }
                assert.deepEqual(mapStep(arr, map), ["aa", "aa", "bb", "bb", "cc", "cc"]);
            });
        });

        describe('Scatter Step', () => {
            it('should scatter array', () => {
                let arr = [
                    {key: "a", value: 1},
                    {key: "a", value: 2},
                    {key: "a", value: "aa"},
                    {key: "b", value: 10},
                    {key: "b", value: null},
                    {key: "c", value: {}}
                ];

                let scattered = {
                    a: [1,2,"aa"],
                    b: [10, null],
                    c: [{}]
                };

                assert.deepEqual(scatterStep(arr), scattered);
            });
        });

        describe('Reduce Step', () => {
            it ('should reduce array', () => {
                let src = {
                    a: [1,2,3],
                    b: [4,5,6],
                    c: [7]
                };

                let reduced = {
                    a: 6,
                    b: 15,
                    c: 7
                };

                function reduce(prev, current) {
                    return prev + current;
                }

                assert.deepEqual(reduceStep(src, reduce, 0), reduced);

            });
        });

        describe ('Map Reduce', () => {

            it('Should throw error if not array (int)', (done) => {
                try {
                    mapReduce(1);
                    done('Did not throw an error');
                } catch (e) {
                    assert.equal(e, "First argument must be an array");
                    done();
                }
            });

            it('Should throw error if not array (object)', (done) => {
                try {
                    mapReduce({});
                    done('Did not throw an error');
                } catch (e) {
                    assert.equal(e, "First argument must be an array");
                    done();
                }
            });

            it('Should throw error if not array (null)', (done) => {
                try {
                    mapReduce(null);
                    done('Did not throw an error');
                } catch (e) {
                    assert.equal(e, "First argument must be an array");
                    done();
                }
            });

            it ('should throw an error if map is not a function', (done) => {
                try {
                    mapReduce([], []);
                    done('Did not throw an error');
                } catch (e) {
                    assert.equal(e, "Second argument must be a function (map function)");
                    done();
                }
            });

            it ('should throw an error if reduce is not a function', (done) => {
                try {
                    mapReduce([], identityFunction, 1);
                    done('Did not throw an error');
                } catch (e) {
                    assert.equal(e, "Third argument must be a function (reduce function)");
                    done();
                }
            });

            it('Should count words in array of strings', () => {
                let strings = ["I want to eat", "I am hungry", "I am sleepy"];
                let results = mapReduce(strings, (str) => {
                    return str.split(" ").map((word) => {
                        return {key:word, value: 1}
                    });
                }, (prev, current) => {
                    return prev + current;
                }, 0);
                let expectedResults = {
                    "I": 3,
                    "want": 1,
                    "to": 1,
                    "eat": 1,
                    "am": 2,
                    "hungry": 1,
                    "sleepy": 1
                };
                assert.deepEqual(results, expectedResults);
            });
        });
    });
};