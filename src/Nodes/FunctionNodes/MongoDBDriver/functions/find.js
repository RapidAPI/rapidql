/**
 * Created by iddo on 7/19/17.
 */

const flattenObject = require('./../utils').flattenObject;

const ObjectId = require('mongodb').ObjectId;

function convertObjectIds(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object')
            obj[key] = convertObjectIds(obj[key]);
        else {
            if (key === "$oid")
                return ObjectId(obj[key]);
        }
    }
    return obj;
}


function unconvertObjectIds(obj) {
    for (let key in obj) {
        if (typeof obj[key] === 'object') {
            if (obj[key]._bsontype == 'ObjectID') {
                obj[key] = obj[key]+"";
            } else {
                obj[key] = unconvertObjectIds(obj[key]);
            }
        }
    }
    return obj;
}


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