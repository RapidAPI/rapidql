/**
 * Created by iddo on 6/28/17.
 */
"use strict";

const assert = require('assert'),
    utils = require('./../utils');

module.exports = () => {
    describe('removeSpecialArgs', ()=> {
        it('should remove a specified argument', () => {
            assert.deepEqual(
                utils.removeSpecialArgs({'a':'111','b':'222'}, ['a']),
                {'b':'222'}
            );
        });

        it('should handle empty key array', () => {
            assert.deepEqual(
                utils.removeSpecialArgs({'a':'111','b':'222'}, []),
                {'a':'111','b':'222'}
            );
        });

        it('should handle an empty object', () => {
            assert.deepEqual(
                utils.removeSpecialArgs({}, ['a']),
                {}
            );
        });

        it('should handle non-existing keys', () => {
            assert.deepEqual(
                utils.removeSpecialArgs({'a':'111','b':'222'}, ['c','d']),
                {'a':'111','b':'222'}
            );
        });
    });

    describe('quoteAsNeeded', () => {
        it('should quote strings', () => {
            assert.equal(utils.quoteAsNeeded('a'), "'a'");
        });

        it('shouldn\'t quote numbers', () => {
            assert.equal(utils.quoteAsNeeded(1), "1");
        });

        it('shouldn\'t quote strings parsed as ints', () => {
            assert.equal(utils.quoteAsNeeded("1"), "1");
        });

        it('shouldn\'t quote strings parsed as floats', () => {
            assert.equal(utils.quoteAsNeeded("1.5"), "1.5");
        });
    });
};