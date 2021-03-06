/**
 * Created by iddo on 8/31/17.
 */
"use strict";

const assert = require('assert'),
    utils = require('../src/Nodes/utils');

describe('Utils', () => {
    describe('resolve', () => {
        it ('should resolve top level object', () => {
            const testObj = {a:12};
            assert.equal(utils.resolve('a', testObj), testObj.a);
        });

        it ('should resolve low level object', () => {
            const testObj = {a:{b: 12}};
            assert.equal(utils.resolve('a.b', testObj), testObj.a.b);
        });

        it ('should throw error on non-existent top level object', (done) => {
            try {
                const testObj = {a:12};
                let v = utils.resolve('c', testObj);
                done(`Didn't fail. Returned value ${v}`);
            } catch (e) {
                assert.equal(e, `Name c does not exist in context {
    "a": 12
}`);
                done();
            }
        });

        it ('should throw error accessing property of non-existent top level object', (done) => {
            try {
                const testObj = {a:12};
                let v = utils.resolve('c.d', testObj);
                done(`Didn't fail. Returned value ${v}`);
            } catch (e) {
                assert.equal(e, `Name c.d does not exist in context {
    "a": 12
}`);
                done();
            }
        });
    });

  describe('createMixedContext', () => {
    it('should return inner context value if only in inner context', () => {
        let context = utils.createMixedContext({}, {a:1});
        assert.equal(context.a, 1);
    });

      it('should return inner context value if only in outer context', () => {
          let context = utils.createMixedContext({a:1}, {});
          assert.equal(context.a, 1);
      });

    it('should give precedence to inner context over outer context, even if property exists in both', () => {
      let context = utils.createMixedContext({a: 2}, {a:1});
      assert.equal(context.a, 1);
    });

    it('should default to outer context if property not in inner context', () => {
      let context = utils.createMixedContext({a:1}, {b:3});
      assert.equal(context.a, 1);
    });

    it ('should return undefined if property doesnt exist in both contexts', () => {
      let context = utils.createMixedContext({a:1}, {b:3});
      assert.equal(context.c, undefined);
    });

    describe('in operator', () => {
       it('should return true if in inner context', () => {
           let context = utils.createMixedContext({}, {a:1});
           assert.equal(true, 'a' in context);
       });

        it('should return true if in outer context', () => {
            let context = utils.createMixedContext({a:1}, {});
            assert.equal(true, 'a' in context);
        });

        it('should return false if not in any context', () => {
            let context = utils.createMixedContext({a:1}, {b:2});
            assert.equal(false, 'c' in context);
        });
    });

      describe('hasOwnProperty operator', () => {
          it('should return true if in inner context', () => {
              let context = utils.createMixedContext({}, {a:1});
              assert.equal(true, context.hasOwnProperty('a'));
          });

          it('should return true if in outer context', () => {
              let context = utils.createMixedContext({a:1}, {});
              assert.equal(true, context.hasOwnProperty('a'));
          });

          it('should return false if not in any context', () => {
              let context = utils.createMixedContext({a:1}, {b:2});
              assert.equal(false, context.hasOwnProperty('c'));
          });
      });

  });
});