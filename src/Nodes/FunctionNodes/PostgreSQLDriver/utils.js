/**
 * Created by iddo on 6/28/17.
 */
/**
 * Remove special selectors (LIMIT, ORDERBY etc...) from query arguments
 * @param queryArgs
 * @returns {*}
 */
function removeSpecialArgs(queryArgs, specialKeys) {
    specialKeys.forEach((key) => {
        delete queryArgs[key];
    });
    return queryArgs;
}


/**
 * Return a string. If value is a string, it'll be quoted. If it's a number or can be parsed as one - it won't.
 * @param value
 * @returns {string}
 */
function quoteAsNeeded(value) {
    return  (typeof value == 'number')  ? `${value}` :
            (!isNaN(parseFloat(value))) ? `${parseFloat(value)}` :
            (typeof value == 'string')  ? `'${value}'`
            : `'${value}'`;
}

module.exports.removeSpecialArgs = removeSpecialArgs;
module.exports.quoteAsNeeded = quoteAsNeeded;