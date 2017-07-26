/**
 * Created by iddo on 7/19/17.
 */

const flattenObject = require('./../utils').flattenObject;
const convertObjectIds = require('./../utils').convertObjectIds;
const unconvertObjectIds = require('./../utils').unconvertObjectIds;

module.exports = (DBTable, db, args) => {
    return new Promise((resolve, reject) => {
        let query = flattenObject(convertObjectIds(args));
        db.collection(DBTable).find(query).toArray((err, doc) => {
            if (err)
                reject(`MongoDB error performing find: ${err}`);
            else {
                let converted = unconvertObjectIds(doc);
                resolve(converted);
            }
        });
    });
};