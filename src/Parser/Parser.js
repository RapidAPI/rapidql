/**
 * Created by Iddo on 12/18/2016.
 */
"use strict";
const nearley = require("nearley"),
    grammer = require("./grammer"),
    peg = require("pegjs");


const WHITE_SPACES = [
    ' ',
    '\n',
    '\t'
];
function removeWhiteSpaces(str) {
    str = str.replace("\n", "").replace("\t", "");
    return str.replace(/\s+(?=((\\[\\"]|[^\\"])*"(\\[\\"]|[^\\"])*")*(\\[\\"]|[^\\"])*$)/g, '');
}
module.exports.removeWhiteSpaces = removeWhiteSpaces;

module.exports.parse = (str) => {
    //Find and replace spaces
    str = removeWhiteSpaces(str);

    return new Promise((resolve, reject) => {
        try {
            resolve(grammer.parse(str));

        } catch(e) {
            reject(e);
        }
    });
};