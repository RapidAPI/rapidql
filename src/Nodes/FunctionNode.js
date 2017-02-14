/**
 * Created by iddo on 12/19/16.
 */
"use strict";
const RapidAPI = require('rapidapi-connect'),
    LeafNode = require('./LeafNode'),
    ObjectNode = require('./ObjectNode'),
    ArrayNode = require('./ArrayNode'),
    CompositeNode = require('./CompositeNode');

const supportedTypes = {
    "RapidAPI": require('./FunctionNodes/RapidAPINode')
};

const SEP_CHAR = '.';

class FunctionNode {
    /**
     * Construct a new functional node, determining it's type at compile time and throwing an error if type doesn't exist.
     * @param name node name
     * @param children node's children (array)
     * @param args node's arguments (object)
     */
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
        
        //Check if type is supported
        if (supportedTypes.hasOwnProperty(this.name.split(SEP_CHAR)[0])) {
            this.type = this.name.split(SEP_CHAR)[0];
            this.name = this.name.split(SEP_CHAR).splice(1).join(SEP_CHAR);
        } else {
            throw `Type Error: Function node type ${this.name.split(SEP_CHAR)[0]} not supported.`;
        }
    }

    /**
     *
     * @returns {string|*}
     */
    getName() {
        return `${this.type}.${this.name}`;
    }

    eval(context, ops) {
        return new Promise((resolve, reject) => {
            //Process args in context
            //If they have " " -> string literal (remove quotes)
            //If they don't -> fetch from context
            let processedArgs = {};
            for (let key in this.args) {
                if (this.args.hasOwnProperty(key)) {
                    let arg = this.args[key];
                    //Check for quotes:
                    if ((arg[0] == `"` && arg[arg.length - 1] == `"`) || (arg[0] == `'` && arg[arg.length - 1] == `'`)) {
                        processedArgs[key] = arg.slice(1, -1); //Remove quotes and add to processed args
                    } else {
                        if (context.hasOwnProperty(arg))
                            processedArgs[key] = context[arg];
                        else {
                            reject(`Name error: name ${arg} does not exist in context`);
                            return;
                        }
                    }
                }
            }

            //Determine material node type and materialize itself
            const MaterialClass = supportedTypes[this.type];
            const materialNode = new MaterialClass(this.getName(), this.children, processedArgs);

            materialNode.eval(context, ops).then(resolve).catch(reject);
        });
        
    }
}

module.exports = FunctionNode;

//PLAYGROUND:

/*let fn = new FunctionNode('RapidAPI.GoogleTranslate.translate', [], {
    'apiKey': '"AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM"',
    'string': '"hello world, what a great day"',
    'targetLanguage': '"de"'
});

let ops = {
    RapidAPI : {
        projectName : 'Iddo_demo_app_1',
        apiKey: '4c6e5cc0-8426-4c95-9e3b-60adba0e50f6'
    }
};

fn.eval({}, ops)
    .then((res) => {console.log(JSON.stringify(res))})
    .catch((err) => {console.warn(JSON.stringify(err))});*/