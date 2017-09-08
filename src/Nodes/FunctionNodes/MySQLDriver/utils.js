/**
 * Created by iddo on 7/21/17.
 */
/**
 * Created by iddo on 6/28/17.
 */
/**
 * Remove special selectors (LIMIT, ORDERBY etc...) from query arguments
 * @param queryArgs
 * @returns {*}
 */
function removeSpecialArgs(queryArgs, _specialKeys) {
    queryArgs = Object.assign({}, queryArgs);
    _specialKeys.forEach((key) => {
        delete queryArgs[key];
    });
    return queryArgs;
}

/**
 * Returns true if val is a number / string with only a number
 * @param val
 * @returns {boolean}
 */
function isNumberParseable(val) {
    return (!isNaN(parseFloat(val)) && `${parseFloat(val)}` === val) || (typeof val == 'number');
}

/**
 * Return a string. If value is a string, it'll be quoted. If it's a number or can be parsed as one - it won't.
 * @param value
 * @returns {string}
 */
function quoteAsNeeded(value) {
    return  (typeof value == 'number')  ? `${value}` :
        (isNumberParseable(value)) ? `${parseFloat(value)}` :
            (typeof value == 'string')  ? `'${value.replace(/'/g, "''")}'`
                : `'${value}'`;
}

/**
 * Return an objects values as an array (pollyfill for ES2017's Object.values)
 * @param obj
 * @returns {Array}
 */
function objValues(obj) {
    return Object.keys(obj).map(key => obj[key]);

}

module.exports.removeSpecialArgs = removeSpecialArgs;
module.exports.isNumberParseable = isNumberParseable;
module.exports.quoteAsNeeded = quoteAsNeeded;
module.exports.objValues = objValues;
