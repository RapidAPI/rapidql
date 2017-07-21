/**
 * Created by iddo on 7/19/17.
 */

const flattenObject = require('./../utils').flattenObject;

module.exports = (DBTable, db, args) => {
    return new Promise((resolve, reject) => {
        db.collection(DBTable).find(flattenObject(args)).toArray((err, doc) => {
            if (err)
                reject(`MongoDB error performing find: ${err}`);
            else
                resolve(doc);
        });
    });
};