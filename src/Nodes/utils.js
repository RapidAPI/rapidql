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
            //if (prev.hasOwnProperty(curr))
          if (prev[curr] !== undefined)
                return prev[curr];
        throw `Name ${path} does not exist in context ${JSON.stringify(object, null, 4)}`;
    }, object);
};

/**
 * Create an object that is a combination of an inner context and outer context. Will strive to return elements from inner context, defaulting to outer if not in inner
 * @param outerContext
 * @param innerContext
 * @returns {Proxy}
 */
module.exports.createMixedContext = (outerContext, innerContext) => {

    if (typeof innerContext != 'object' || typeof outerContext != 'object')
        throw `Contexts must be of object type`;

    const handler = {
        get: (target, name) => {
            // Lookup order: innerContext > outerContext > undefined
            // JS is ugly. Using "in" instead of !== undefined would have been MUCH nicer, but in is not supported with Proxy... (WHY????)
            return target.innerContext[name] !== undefined ? target.innerContext[name]
                 : target.outerContext[name] !== undefined ? target.outerContext[name]
                 : undefined;
        },
        has: (target, name) => {
            return name in target.innerContext || name in target.outerContext;
        },
        getOwnPropertyDescriptor: (target, name) => {
            if (name in target.innerContext || name in target.outerContext) {
                return {
                    enumerable : true,
                    configurable : true,
                    writable : true
                };
            }
            return undefined;
        }
    };

    // Add support for native functions
    // Proxy.prototype.hasOwnProperty = function (name) {
    //     return this[name] !== undefined ? this[name] : false;
    // };

    return new Proxy({
      innerContext,
      outerContext
    }, handler);
};