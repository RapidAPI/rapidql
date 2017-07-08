/**
 * Created by iddo on 7/7/17.
 */
"use strict";

const assert = require('assert'),
    setClauseGenerator = require('./../updateGenerator').setClauseGenerator;

module.exports = () => {
    describe("setClauseGenerator", () => {
        it('should support empty updates', () => {
            assert.equal(setClauseGenerator({}), "");
        });

        it('should support single update', () => {
            assert.equal(setClauseGenerator({'a':'b'}), " SET a = 'b'");
        });

        it('should support multiple updates', () => {
            assert.equal(setClauseGenerator({'a':'b', 'c': 1}), " SET a = 'b', c = 1");
            assert.equal(setClauseGenerator({'a':'b', 'c': 1, 'd': 'a'}), " SET a = 'b', c = 1, d = 'a'");
        });
    });
};