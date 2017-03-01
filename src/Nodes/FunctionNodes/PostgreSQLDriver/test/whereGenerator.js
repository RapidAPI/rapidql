/**
 * Created by iddo on 2/16/17.
 */
"use strict";

const assert = require('assert'),
    whereGenerator = require('./../whereGenerator');

module.exports = () => {
    describe('Where generator', ()=> {
        describe('Simple queries', () => {
            it('should support empty queries', () => {
                assert.equal(whereGenerator({}), "");
            });
            it('should support queries with a single condition', () => {
                assert.equal(whereGenerator({a:'1'}), " WHERE a = '1'");
            });

            it('should support queries with multiple parameters', () => {
                assert.equal(whereGenerator({a:'1', b:'ccc'}), " WHERE a = '1' AND b = 'ccc'")
            });

            it('should support queries with complex parameters', () => {
                assert.equal(whereGenerator({a: {'>': '2'}}), " WHERE a > 2");
                assert.equal(whereGenerator({a: {'>=': '2'}}), " WHERE a >= 2"); //Multi character operation
            })
        });
    });
};