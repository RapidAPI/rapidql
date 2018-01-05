/**
 * Created by iddo on 1/5/18.
 */
const { expect, assert } = require('chai');
const CsvNode = require('./../CsvNode');

module.exports = () => {
  describe('reading csv file', () => {
    it('should read a file with a header column', async () => {
      let node = new CsvNode('Csv.read', [], {
        file: "./src/Nodes/FunctionNodes/CsvDriver/test/sample.csv",
        columns: "true"
      });

      const results = await node.eval({}, {});

      assert.equal(results.length, 5); // 5 results
      results.forEach(r => assert.typeOf(r, 'object')); // all objects
      results.forEach(r => assert.hasAllKeys(r, ['name','age','sex'])); // has right keys
    });
  });
};