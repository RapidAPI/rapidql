/**
 * Created by iddo on 8/27/17.
 */
const SEP_CHAR = '.';
const NODE_NAME = 'MapReduce';
const mapReduce = require('./mapReduce').mapReduce;

class MapReduceNode {
    constructor (name, children, args) {
        // Check # of children
        if (0 >= children.length) {
            throw `MapReduce Error: node needs 1 child. 0 found.`;
        } else if (1 < children.length) {
            console.warn(`MapReduce Warning: MapReduce node got ${children.length} children. Only first one - ${children[0].getName()} will be used. Children: `);
            children.map((child) => {console.log (`- ${child.getName()}`)});
        }

        // Get pipe name
        const tokenizedName = name.split(SEP_CHAR);
        // Check there is a pipe object identifier
        if (tokenizedName.length < 2)
            throw `MapReduce Error: No pipe name. Should be MapReduce.pipeName(){}`;
        const pipeName = tokenizedName[1];

        this.name = name;
        this.args = args;
        this.children = children;
        this.pipeName = pipeName;
    }

    getName () {
        return `${this.name}`;
    }

    async eval (context, ops) {
        // Make sure pipe exists in ops
        if (!ops.hasOwnProperty("MapReduce") ||
            !ops['MapReduce'].hasOwnProperty(this.pipeName) ||
            typeof ops['MapReduce'][this.pipeName] !== 'object')
            throw `MapReduce Error: Options object doesn't have MapReduce configurations / configurations are invalid.`;

        const pipe = ops['MapReduce'][this.pipeName];

        // Make sure pipe has right data
        if(!pipe.hasOwnProperty("map") || typeof pipe["map"] !== 'function')
            throw `MapReduce Error: pipe does not have "map" function / parameter is not a valid function`;
        if(!pipe.hasOwnProperty("reduce") || typeof pipe["reduce"] !== 'function')
            throw `MapReduce Error: pipe does not have "reduce" function / parameter is not a valid function`;
        if(!pipe.hasOwnProperty("reduceInitial"))
            throw `MapReduce Error: pipe does not have "reduceInitial" value`;

        let innerContext = Object.assign({}, context);
        let innerNode = this.children[0];
        const childResult = await innerNode.eval(innerContext, ops);

        if (!Array.isArray(childResult))
            throw `MapReduce Error: internal results is not an array, and thus cannot be MapReduced. Type is: ${typeof childResult}.`;

        const result = mapReduce(childResult, pipe["map"], pipe["reduce"], pipe["reduceInitial"]);
        this.children = []; // Removing children so it doesn't recurse down the tree again.
        return result;
    }
}

module.exports = MapReduceNode;