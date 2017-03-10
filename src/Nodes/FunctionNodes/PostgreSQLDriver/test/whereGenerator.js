/**
 * Created by iddo on 2/16/17.
 */
"use strict";

const assert = require('assert'),
    whereGenerator = require('./../whereGenerator');

module.exports = () => {
    describe('Where generator', ()=> {
        describe('Simple shorthand queries', () => {
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

        describe('Simple full queries', () => {
            it('should support empty queries', () => {
                assert.equal(whereGenerator({WHERE:{}}), "");
            });
            it('should support queries with a single condition', () => {
                assert.equal(whereGenerator({WHERE:{a:'1'}}), " WHERE a = '1'");
            });

            it('should support queries with multiple parameters', () => {
                assert.equal(whereGenerator({WHERE:{a:'1', b:'ccc'}}), " WHERE a = '1' AND b = 'ccc'")
            });

            it('should support queries with complex parameters', () => {
                assert.equal(whereGenerator({WHERE:{a: {'>': '2'}}}), " WHERE a > 2");
                assert.equal(whereGenerator({WHERE:{a: {'>=': '2'}}}), " WHERE a >= 2"); //Multi character operation
            })
        });

        describe('Complex queries', () => {
            describe('LIMIT', () => {
                it('should add a LIMIT clause for an empty query', () => {
                    assert.equal(whereGenerator({LIMIT:"5"}), " LIMIT 5");
                });

                it('should add a LIMIT clause for a non empty shorthand query', () => {
                    assert.equal(whereGenerator({a:'1', LIMIT:"5"}), " WHERE a = '1' LIMIT 5");
                });

                it('should add a LIMIT clause for a non empty full query', () => {
                    assert.equal(whereGenerator({WHERE: {a:'1'}, LIMIT:"5"}), " WHERE a = '1' LIMIT 5");
                });
            });

            describe('SKIP', () => {
                it('should add a SKIP clause for an empty query', () => {
                    assert.equal(whereGenerator({SKIP:"5"}), " SKIP 5");
                });

                it('should add a SKIP clause for a non empty shorthand query', () => {
                    assert.equal(whereGenerator({a:'1', SKIP:"5"}), " WHERE a = '1' SKIP 5");
                });

                it('should add a SKIP clause for a non empty full query', () => {
                    assert.equal(whereGenerator({WHERE: {a:'1'}, SKIP:"5"}), " WHERE a = '1' SKIP 5");
                });
            });

            describe('ORDER BY', () => {
                it('should support shorthand ORDER BY clause', () => {
                    assert.equal(whereGenerator({ORDERBY:"year"}), " ORDER BY year");
                });

                it('should support full ORDER BY clause with 1 field', () => {
                    assert.equal(whereGenerator({ORDERBY:{"murders":'DESC'}}), " ORDER BY murders DESC");
                });

                it('should support full ORDER BY clause with multiple fields', () => {
                    assert.equal(whereGenerator({ORDERBY:{"murders":'DESC', 'regrets': 'ASC'}}), " ORDER BY murders DESC, regrets ASC"); //Thesis - ppl with more murders (i.e. serial murders) have less regrets.
                });
            })
        });
    });
};