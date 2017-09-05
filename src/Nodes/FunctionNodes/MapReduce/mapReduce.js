/**
 * Created by iddo on 8/24/17.
 */

/**
 * Maps the array using the provided map function
 * @param arr the array of objects to be mapped
 * @param map map function. Accepts a single array item, and can return either a single item, or an array of items. Each item should have the structure {key: "", value: ...}.
 * @returns {*}
 */
function mapStep(arr, map) {
    return arr.map(map).reduce((prev, current) => {
        return prev.concat(current);
    },[]);
}

/**
 * Scatter an array into an object. From [{key:"a", value: "1"}, {key:"a", value: "2"}, {key:"b", value: "1"}] to {a: ["1", "2"], b: ["1"]}
 * @param mapped Array of form [{key:"a", value: "1"}, ...]
 * @returns {*} object of form {a: ["1", "2"], b: ["1"]}
 */
function scatterStep(mapped) {
    return mapped.reduce((prev, current) => {
        if (prev.hasOwnProperty(current["key"])) {
            prev[current["key"]].push(current["value"]);
            return prev;
        } else {
            prev[current["key"]] = [current["value"]];
            return prev;
        }
    }, {});
}

/**
 * Applies they user provided reduce function
 * @param grouped object of form {a: ["1", "2"], b: ["1"]}
 * @param reduce reduce function f(previous, current)
 * @param reduceInitial initial value to be used as previous when applying reduce.
 * @returns {*} object of form {a: ReducedValue, b: ReducedValue}
 */
function reduceStep(grouped, reduce, reduceInitial = null) {
    return Object.keys(grouped).reduce((previous, current) => {
        previous[current] = grouped[current].reduce(reduce, reduceInitial);
        return previous;
    }, {});
}

function mapReduce(arr, map, reduce, reduceInitial) {
    // Input validation step
    if (!Array.isArray(arr))
        throw "First argument must be an array";
    else if (typeof map !== "function")
        throw "Second argument must be a function (map function)";
    else if (typeof reduce !== "function")
        throw "Third argument must be a function (reduce function)";

    // Map step
    const mapped = mapStep(arr, map);
    /* users's map returns an array of {key: "", value: ...} objects, the reduce-concat step flattens it */

    // Scatter step
    const grouped = scatterStep(mapped);

    // Reduce Step
    // This is why I'm using reduce and not map: https://stackoverflow.com/questions/14810506/map-function-for-objects-instead-of-arrays
    const reduced = reduceStep(grouped, reduce, reduceInitial);

    return reduced;
}

module.exports.mapReduce       = mapReduce;
module.exports.mapStep         = mapStep;
module.exports.scatterStep     = scatterStep;
module.exports.reduceStep      = reduceStep;

// TEST
/*let strings = ["I want to eat", "I am hungry", "I am sleepy"];

let results = mapReduce(strings, (str) => {
    return str.split(" ").map((word) => {
        return {key:word, value: 1}
    });
}, (prev, current) => {
    return prev + current;
}, 0);

console.log(results);*/