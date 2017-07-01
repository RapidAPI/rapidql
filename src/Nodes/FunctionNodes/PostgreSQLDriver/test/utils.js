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

    describe('isNumberParseable', () => {
        it('should identify number parseable', () => {
            assert.equal(utils.isNumberParseable("1"), true);
            assert.equal(utils.isNumberParseable("1.5"), true);
            assert.equal(utils.isNumberParseable("-1.5"), true);
            assert.equal(utils.isNumberParseable(-1.5), true);
        });

        it('should identify non number parseable', () => {
            assert.equal(utils.isNumberParseable("1 apple"), false);
            assert.equal(utils.isNumberParseable("iddo"), false);
            assert.equal(utils.isNumberParseable("2017-1"), false);
        });
    });

    describe('quoteAsNeeded', () => {
        it('should quote strings', () => {
            assert.equal(utils.quoteAsNeeded('a'), "'a'");
        });

        it('should escape a single quote in strings', () => {
            assert.equal(utils.quoteAsNeeded("a'"), "'a'''");
        });

        it('should escape multiple quotes in strings', () => {
            assert.equal(utils.quoteAsNeeded("a' b'"), "'a'' b'''");
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

    describe('objValues', () => {
        it('should get an objects values', () => {
            assert.deepEqual(utils.objValues({'s':'ss', 'a':1}), ['ss',1])
        });
    });
};