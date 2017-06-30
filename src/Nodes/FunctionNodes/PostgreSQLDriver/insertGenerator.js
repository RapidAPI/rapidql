/**
 * Created by iddo on 6/29/17.
 */
const removeSpecialArgs = require('./utils').removeSpecialArgs;
const quoteAsNeeded = require('./utils').quoteAsNeeded;
const objValues = require('./utils').objValues;

function epochToSqlTimestamp(timestamp) {
    return (new Date(parseInt(timestamp))).toISOString().slice(0, 19).replace('T', ' ');
}

function typeConverter(arg) {
    return  (typeof arg != 'object') ? arg :
            (arg.hasOwnProperty('timestamp') && !isNaN(parseInt(arg.timestamp))) ? epochToSqlTimestamp(arg.timestamp) :
            null;
}
module.exports.typeConverter = typeConverter;

module.exports.insertClauseGenerator = (DBSchema, DBTable, args) => {

    //Base query
    let query = 'INSERT INTO';

    //Add relation name
    query += ` ${DBSchema}.${DBTable}`;

    //Add Columns
    query += ` (${Object.keys(args).join(", ")})`;

    //Add Values
    query += ` VALUES (${objValues(args).map(typeConverter).map(quoteAsNeeded).join(", ")})`;

    return query;
};