/**
 * Created by Iddo on 12/18/2016.
 */
const nearley = require("nearley"),
    grammer = require("./grammer");

let p = new nearley.Parser(grammer.ParserRules, grammer.ParserStart);

p.feed("1   +(2+3)");
console.log(JSON.stringify(p.results));