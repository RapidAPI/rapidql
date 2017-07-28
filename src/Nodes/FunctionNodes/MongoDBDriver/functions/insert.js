/**
 * Created by iddo on 7/28/17.
 */
const flattenObject = require('./../utils').flattenObject;
const convertObjectIds = require('./../utils').convertObjectIds;
const unconvertObjectIds = require('./../utils').unconvertObjectIds;

module.exports = (DBTable, db, args) => {
    return new Promise((resolve, reject) => {
        const newObj = args;
        db.collection(DBTable).insertOne(newObj, (err, doc) => {
            if (err)
                reject(`MongoDB error performing insert: ${err}`);
            else {
                resolve(doc);
            }
        });
    });
};