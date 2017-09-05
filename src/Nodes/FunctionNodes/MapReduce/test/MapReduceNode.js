/**
 * Created by iddo on 9/1/17.
 */
const chai = require("chai");
chai.use(require("chai-as-promised"));
const { expect, assert } = chai;
const MapReduceNode = require('./../MapReduceNode');
const LeafNode = require('./../../../LeafNode'),
    ArrayNode = require('./../../../ArrayNode');

module.exports = () => {
    describe("MapReduceNode", () => {
         describe("initial validation", () => {
             it("should throw error when initialized with 0 children", () => {
                 assert.throws(() => {
                     new MapReduceNode("sdf", [], {})
                 }, `MapReduce Error: node needs 1 child. 0 found.`);
             });

             it("should throw error when initialized without pipe name", () => {
                 assert.throws(() => {
                     new MapReduceNode("pipe", [new LeafNode("a")], {})
                 }, `MapReduce Error: No pipe name. Should be MapReduce.pipeName(){}`);
             });
        });

         describe("runtime validations", () => {
             const invalidNode = new MapReduceNode('MapReduce.pipe', [new LeafNode("a")], {});
             const invalidContext = {a:1};

             it("should throw error if there are no MapReduce configurations", () => {
                 return expect(invalidNode.eval(invalidContext, {})).to.be.rejectedWith(`MapReduce Error: Options object doesn't have MapReduce configurations / configurations are invalid.`);
             });

             it("should throw error if MapReduce configurations doesn't have specific pipe", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {}})).to.be.rejectedWith(`MapReduce Error: Options object doesn't have MapReduce configurations / configurations are invalid.`);
             });

             it("should throw error if MapReduce configurations doesn't have map function", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     reduce: () => {},
                     reduceInitial: 0
                 }}})).to.be.rejectedWith(`MapReduce Error: pipe does not have "map" function / parameter is not a valid function`);
             });

             it("should throw error if MapReduce configuration's map isn't a function", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     map: 1,
                     reduce: () => {},
                     reduceInitial: 0
                 }}})).to.be.rejectedWith(`MapReduce Error: pipe does not have "map" function / parameter is not a valid function`);
             });

             it("should throw error if MapReduce configurations doesn't have reduce function", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     map: () => {},
                     reduceInitial: 0
                 }}})).to.be.rejectedWith(`MapReduce Error: pipe does not have "reduce" function / parameter is not a valid function`);
             });

             it("should throw error if MapReduce configuration's reduce isn't a function", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     map: () => {},
                     reduce: 1,
                     reduceInitial: 0
                 }}})).to.be.rejectedWith(`MapReduce Error: pipe does not have "reduce" function / parameter is not a valid function`);
             });

             it("should throw error if MapReduce configurations doesn't have reduceInitial", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     map: () => {},
                     reduce: () => {}
                 }}})).to.be.rejectedWith(`MapReduce Error: pipe does not have "reduceInitial" value`);
             });

             it("should throw an error if MapReduce internal result is not an array", () => {
                 return expect(invalidNode.eval(invalidContext, {MapReduce: {pipe: {
                     map: () => {},
                     reduce: () => {},
                     reduceInitial: 0
                 }}})).to.be.rejectedWith(`MapReduce Error: internal results is not an array, and thus cannot be MapReduced. Type is: ${typeof 1}.`);
             });
         });
    });
};