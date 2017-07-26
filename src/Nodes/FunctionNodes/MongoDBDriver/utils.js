/**
 * Created by iddo on 7/20/17.
 */
const flattenObject = (obj) => {
    let toReturn = {};

    for (let key in obj) {
        if(obj.hasOwnProperty(key)) {
            if(typeof obj[key] !== 'object') {
                toReturn[key] = obj[key];
            } else if (obj[key]._bsontype !== 'ObjectID') {
                let internalObj = flattenObject(obj[key]);

                for (let internalKey in internalObj) {
                    if (internalObj.hasOwnProperty(internalKey)) {
                        toReturn[`${key}.${internalKey}`] = internalObj[internalKey];
                    }
                }
            } else {
                toReturn[key] = obj[key];
            }
        }
    }

    return toReturn;
};
module.exports.flattenObject = flattenObject;


const ObjectId = require('mongodb').ObjectId;
module.exports.ObjectId = ObjectId;

/**
 * This function takes a MongoDB query and converts {"$oid":"5dfg5k6jh4k645l6h4"} to ObjectIds.
 * @param obj
 * @returns {*}
 */
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
module.exports.convertObjectIds = convertObjectIds;


/**
 * This function takes a MongoDB document and converts ObjectIDs to Strings
 * @param obj
 * @returns {*}
 */
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
module.exports.unconvertObjectIds = unconvertObjectIds;

const specialKeys = ["FIELD"];
function removeSpecialArgs(queryArgs) {
    queryArgs = Object.assign({}, queryArgs);
    specialKeys.forEach((key) => {
        delete queryArgs[key];
    });
    return queryArgs;
}
module.exports.removeSpecialArgs = removeSpecialArgs;

// MongoDB only support functions in ES5 format. Unfortunetly.
// const reducers = {
//     avg : arr => arr.map(a => parseFloat(a)).reduce( ( p, c ) => p + c, 0 ) / arr.length,
//     max : arr => Math.max(...arr.map(a => parseFloat(a))),
//     min : arr => Math.min(...arr.map(a => parseFloat(a))),
//     sum : arr => arr.map(a => parseFloat(a)).reduce( ( p, c ) => p + c, 0 )
// };
const reducers = {
    avg : arr => arr.map(a => parseFloat(a)).reduce( ( p, c ) => p + c, 0 ) / arr.length,
    max : arr => Math.max(...arr.map(a => parseFloat(a))),
    min : arr => Math.min(...arr.map(a => parseFloat(a))),
    sum : function (arr) {
        return arr.map(function (a) {
            return parseFloat(a);
        }).reduce(function (p, c) {
            return p + c;
        }, 0);
    }
};
module.exports.reducers = reducers;