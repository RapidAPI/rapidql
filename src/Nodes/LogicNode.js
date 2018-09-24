/**
 * Created by iddo on 9/22/18.
 */
const SEP_CHAR = '.';

const FunctionNode = require('./FunctionNode'); // Uses recursive replace from there
const ObjectNode = require('./ObjectNode');
const { createMixedContext } = require('./utils');

function __if(args, _) {
    const val1 = args['val1'];
    const val2 = args['val2'];
    const comparison = args['comparison'] || "==";

    switch (comparison) {
        case "==":
            return val1 == val2;
            break;
        case "!=":
            return val1 != val2;
            break;
        case ">":
            return val1 > val2;
            break;
        case "<":
            return val1 < val2;
            break;
        case ">=":
            return val1 >= val2;
            break;
        case "<=":
            return val1 <= val2;
            break;
        case "set":
            return !!val1;
            break;
        case "prefixes": //val1 prefixes val2
            if (`${val1}`.length > `${val2}`.length) return false;
            return `${val1}` === `${val2}`.substr(0, val1.length);
            break;
        case "notSet":
            return !val1;
            break;
    }
}

function __prefix(args) {
    return __if({
        val1        : args['prefix'],
        val2        : args['string'],
        comparison  : 'prefixes'
    })
}

function __equal(args) {
    return __if({
        val1        : args['val1'],
        val2        : args['val2'],
        comparison  : '=='
    })
}

const __ops = {
    "if"        : __if,
    "prefix"    : __prefix,
    "equal"     : __equal
};

class LogicNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return `@${this.name.slice(0,-1)}`; //Get rid of preceding dot
    }

    /**
     * Process arguments and replace variables based on context
     * @param context
     * @returns {{}}
     */
    getProcessedArgs(context) {
        //Process args in context
        //If they have " " -> string literal (remove quotes)
        //If they don't -> fetch from context
        return require('./FunctionNode').recursiveReplace(this.args, context); //Weird issues with using the FunctionNode object. To be explored
    }

    async eval(context, ops) {

        const operation = this.getName().slice(1);

        try {

            const result = __ops[operation](this.getProcessedArgs(context), null);

            if (!result)
                return null;

            let innerContext = createMixedContext(context, {
                [this.getName()] : {}
            });
            let innerNode = new ObjectNode(this.getName(), this.children);
            return await innerNode.eval(innerContext, ops);

        } catch (e) {
            throw `Error in ${this.getName()}: ${e}`;
        }
    }
}

LogicNode.logicFunctions = __ops;

module.exports = LogicNode;