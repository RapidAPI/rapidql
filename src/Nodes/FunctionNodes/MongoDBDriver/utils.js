/**
 * Created by iddo on 7/20/17.
 */
const flattenObject = (obj) => {
    let toReturn = {};

    for (let key in obj) {
        if(obj.hasOwnProperty(key)) {
            if(typeof obj[key] !== 'object') {
                toReturn[key] = obj[key];
            } else {
                let internalObj = flattenObject(obj[key]);

                for (let internalKey in internalObj) {
                    if (internalObj.hasOwnProperty(internalKey)) {
                        toReturn[`${key}.${internalKey}`] = internalObj[internalKey];
                    }
                }
            }
        }
    }

    return toReturn;
};

module.exports.flattenObject = flattenObject;