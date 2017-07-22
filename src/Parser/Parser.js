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

module.exports.parse = (str) => {
    //Find and replace spaces
    str = str.replace(/\s+(?=([^"]*"[^"]*")*[^"]*$)/g, '');

    return new Promise((resolve, reject) => {
        try {
            resolve(grammer.parse(str));

        } catch(e) {
            reject(e);
        }
    });
};
