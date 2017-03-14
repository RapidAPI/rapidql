/**
 * Created by Iddo on 12/17/2016.
 */

"use strict";

const RQL = require('./src/RQL');

module.exports = RQL;

function pipe(...funcs) {
    return function(values) {
        return funcs.reduce(function(vals, f) {
            return f(vals);
        }, values);
    }
}