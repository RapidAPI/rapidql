/**
 * Created by iddo on 7/19/17.
 */
module.exports.getArg = async (obj, key) => {
    if (!obj['key'])
        throw `Redis error - "${key}" is required`;
    else
        return obj[key];
};

module.exports.flattenObject = obj => Object.keys(obj).reduce((r, k) => {return r.concat(k, obj[k]);}, []);