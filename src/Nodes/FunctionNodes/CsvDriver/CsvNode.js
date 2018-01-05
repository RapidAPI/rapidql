/**
 * Created by iddo on 1/5/18.
 */
const fs    = require('fs');
const parse = require('csv').parse;

class CsvNode {
  constructor(name, children, args) {
    this.name = name;
    this.args = args;
    this.children = children;
  }

  getName() {
    return `${this.name}`;
  }

  eval(context, ops) {
    return new Promise((resolve, reject) => {
      const self = this;

      const file          = self.args['file'] || "",
        auto_parse        = self.args['auto_parse'] !== undefined ?  self.args['auto_parse'] === 'true' : true,
        auto_parse_date   = self.args['auto_parse_date'] !== undefined ?  self.args['auto_parse_date'] === 'true' : true,
        columns           = self.args['columns'] !== undefined ?  self.args['columns'] === 'true' : true,
        delimiter         = self.args['delimiter'] || ",";

      const parser = parse({columns, delimiter, auto_parse, auto_parse_date}, function(err, data){
        if (err)
          reject(`Error reading CSV file: ${err}`);
        resolve(data);
      });

      fs.createReadStream(file).pipe(parser);

    });
  }
}
module.exports = CsvNode;


/** TEST **/
// let node = new CsvNode('Csv.read', [], {
//   file: "./sample.csv",
//   columns: "true"
// });
//
// node.eval({}, {}).then(console.log).catch(console.warn);