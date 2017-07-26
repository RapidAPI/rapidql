/**
 * Created by iddo on 7/21/17.
 */
const flattenObject = require('./../utils').flattenObject;
const convertObjectIds = require('./../utils').convertObjectIds;
const unconvertObjectIds = require('./../utils').unconvertObjectIds;
const removeSpecialArgs = require('./../utils').removeSpecialArgs;
const reducers = require('./../utils').reducers;


const aggregate = (DBTable, db, args, aggregateFunction) => {
    return new Promise((resolve, reject) => {
        let query = flattenObject(convertObjectIds(removeSpecialArgs(args)));
        db.collection(DBTable).mapReduce(
            function() { //MAP
                emit(""+fieldName, ""+this[fieldName]);
            },
            reducers[aggregateFunction], //REDUCE
            {
                query: query,
                out : { inline: 1 },
                scope: {
                    fieldName: args['FIELD']
                }
            },
            (err, doc) => {
            if (err)
                reject(`MongoDB error performing find: ${err}`);
            else {
                let result = {
                    [args['FIELD']]: doc[0]['value']
                };
                resolve(result);
            }
        });
    });
};

module.exports = (aggregateFunction) => {
    return function (DBTable, db, args) {
        return aggregate(DBTable, db, args, aggregateFunction);
    }
};