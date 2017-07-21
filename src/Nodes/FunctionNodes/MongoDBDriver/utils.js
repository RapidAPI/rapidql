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