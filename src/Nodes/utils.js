/**
 * Created by iddo on 8/31/17.
 */

/**
 * Find an object's property from a path
 * @param path dot notation path (a.b.c)
 * @param object object for property to be pulled from
 * @returns {*}
 */
module.exports.resolve = (path, object) => {
    return path.split('.').reduce(function (prev, curr) {
        if (prev)
            if (prev.hasOwnProperty(curr))
                return prev[curr];
        throw `Name ${path} does not exist in context ${JSON.stringify(object, null, 4)}`;
    }, object);
};