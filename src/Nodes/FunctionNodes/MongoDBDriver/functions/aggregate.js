/**
 * Created by iddo on 7/21/17.
 */
const flattenObject = require('./../utils').flattenObject;
const convertObjectIds = require('./../utils').convertObjectIds;
const unconvertObjectIds = require('./../utils').unconvertObjectIds;
const removeSpecialArgs = require('./../utils').removeSpecialArgs;


const aggregate = (DBTable, db, args, aggregateFunction) => {
    return new Promise((resolve, reject) => {
        const field = args['FIELD'];
        let query = flattenObject(convertObjectIds(removeSpecialArgs(args)));
        db.collection(DBTable).aggregate([
            {$match:query},
            {$group: {
                "_id": null,
                [field]: {[aggregateFunction]: `$${field}`}
            }}
        ], (err, result) => {
            if (err) {
                reject(`MongoDB error performing aggregation: ${err}`);
            } else {
                resolve(result[0]);
            }
        });
        // db.collection(DBTable).mapReduce(
        //     function() { //MAP
        //         emit(""+fieldName, ""+this[fieldName]);
        //     },
        //     reducers[aggregateFunction], //REDUCE
        //     {
        //         query: query,
        //         out : { inline: 1 },
        //         scope: {
        //             fieldName: args['FIELD']
        //         }
        //     },
        //     (err, doc) => {
        //     if (err)
        //         reject(`MongoDB error performing aggregation: ${err}`);
        //     else {
        //         let result = {
        //             [args['FIELD']]: doc[0]['value']
        //         };
        //         resolve(result);
        //     }
        // });
    });
};

module.exports = (aggregateFunction) => {
    return function (DBTable, db, args) {
        return aggregate(DBTable, db, args, `$${aggregateFunction}`);
    }
};