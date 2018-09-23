/**
 * Created by iddo on 9/22/18.
 */
const SEP_CHAR = '.';

const FunctionNode = require('./FunctionNode'); // Uses recursive replace from there
const { createMixedContext } = require('./utils');

/**
 * Logic.switch(value: "", ?comparison: "") {}
 * @private
 */
function __switch(args, childrenLabels) {
    const val = args['value'];
    const comparison = args['comparison'] || "==";
}

function __if(args, _) {
    const val1 = args['val1'];
    const val2 = args['val2'];
    const comparison = args['comparison'] || "==";

    switch (comparison) {
        case "==":
            return val1 == val2 ? 'true' : 'false';
            break;
    }
}

const __ops = {
    "if"        : __if,
    "switch"    : __switch
};

// TODO this should support recursive replace (from Function node) and tree expansion

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
        const self = this;

        const operation = this.getName().slice(1);

        try {

            const result = __ops[operation](this.getProcessedArgs(context), null);
            const resultNodes = this.children.filter(c => c.getName() === result);
            if (resultNodes.length === 0)
                return null;
            else
                return await resultNodes[0].eval(createMixedContext(context, {[result]: {}}), ops);

        } catch (e) {
            throw `Error in ${this.getName()}: ${e}`;
        }
    }
}

LogicNode.logicFunctions = __ops;

module.exports = LogicNode;