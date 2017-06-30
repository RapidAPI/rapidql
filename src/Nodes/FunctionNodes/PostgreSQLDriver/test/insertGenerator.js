/**
 * Created by iddo on 6/29/17.
 */
"use strict";

const assert = require('assert'),
    insertClauseGenerator = require('./../insertGenerator').insertClauseGenerator,
    typeConverter = require('./../insertGenerator').typeConverter;

module.exports = () => {
    describe('typeConverter', () => {
        it('should return strings as is', () => {
            assert.equal(typeConverter("a"), "a");
        });

        it('should return numbers as is', () => {
            assert.equal(typeConverter(1), 1);
            assert.equal(typeConverter(1.5), 1.5);
        });

        it('should wrap timestamps', () => {
            assert.deepEqual(typeConverter({"timestamp": 1498787839257}), '2017-06-30 01:57:19')
        });
    });


    describe('insertClauseGenerator', ()=> {
        it('should support empty insert', () => {
            assert.equal(insertClauseGenerator('a','b',{}), "INSERT INTO a.b () VALUES ()")
        });

        it('should support single key', () => {
            assert.equal(insertClauseGenerator('a','b',{a:"aaa"}), "INSERT INTO a.b (a) VALUES ('aaa')")
        });

        it('should support multiple keys', () => {
            assert.equal(insertClauseGenerator('a','b',{a:"aaa", b:3}), "INSERT INTO a.b (a, b) VALUES ('aaa', 3)")
        });
    });
};