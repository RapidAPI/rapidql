/**
 * Created by iddo on 12/19/16.
 */
"use strict";
const LeafNode = require('./LeafNode'),
    ObjectNode = require('./ObjectNode'),
    ArrayNode = require('./ArrayNode'),
    CompositeNode = require('./CompositeNode');

const { createMixedContext } = require('./utils');

const Mustache = require('mustache');

const supportedTypes = {
    "RapidAPI"      : require('./FunctionNodes/RapidAPIDriver/RapidAPINode'),
    "PostgreSQL"    : require('./FunctionNodes/PostgreSQLDriver/PostgreSQLNode'),
    "MySQL"         : require('./FunctionNodes/MySQLDriver/MySQLNode'),
    "Http"          : require('./FunctionNodes/HttpDriver/HttpNode'),
    "Redis"         : require('./FunctionNodes/RedisDriver/RedisNode'),
    "MongoDB"       : require('./FunctionNodes/MongoDBDriver/MongoDBNode'),
    "MapReduce"     : require('./FunctionNodes/MapReduce/MapReduceNode'),
    "Csv"           : require('./FunctionNodes/CsvDriver/CsvNode')
};

const SEP_CHAR = '.';

/**
 * Get's a key's value from the context or throws a 'Does not exist' error
 * @param key
 * @param context
 */
function getFromContext(key, context) {
    if (context.hasOwnProperty(key))
        return context[key];
    else {
        throw `Name error: name ${key} does not exist in context`;
    }
}

/**
 * Check if a string is wrapped in quotes
 * @param arg the string to be checked
 * @returns {boolean}
 */
function quoted(arg) {
    return ((arg[0] == `"` && arg[arg.length - 1] == `"`) || (arg[0] == `'` && arg[arg.length - 1] == `'`));
}

/**
 * If key is surrounded by quotes, this will remove them
 * @param key
 * @returns {Array.<T>|string|Blob|ArrayBuffer}
 */
function removeQuotes(key) {
    return quoted(key) ? key.slice(1, -1) : key;
}


/**
 * Replaces template ({{var}}) with values from the context
 * @param value the template
 * @param context
 */
function replaceVariables(value, context) {
    return Mustache.render(value, context);
}

/**
 * Processes the arg tree, keeping constants and replacing vars from the context
 * @param args arg tree to be processed
 * @param context context to take variable values from
 * @returns {{}}
 */
function recursiveReplace(args, context) {
    let processedArgs = {};
    for (let key in args) {
        if (args.hasOwnProperty(key)) {
            let arg = args[key];

            //remove quotes from key if needed
            key = removeQuotes(key);
            
            //If string, process directly. Else, recurse down the rabbit hole.
            switch (typeof arg) {
                case 'string':
                    //Check for quotes:
                    processedArgs[key] = quoted(arg) ? replaceVariables(arg.slice(1, -1), context) : getFromContext(arg, context);
                    //If literal - Remove quotes, render template and add to processed args
                    // If Variable - get from context
                    break;
                case 'number':
                    processedArgs[key] = arg;
                    break;
                case 'object':
                    processedArgs[key] = recursiveReplace(arg, context);
                    break;
                default:
                    throw `Type Error: type ${typeof arg} for argument ${key} is not supported`;
                    break;
            }
        }
    }
    return processedArgs;
}

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
   * Process arguments and replace variables based on context
   * @param context
   * @returns {{}}
   */
    getProcessedArgs(context) {
        //Process args in context
        //If they have " " -> string literal (remove quotes)
        //If they don't -> fetch from context
        return recursiveReplace(this.args, context);
    }

    /**
     *
     * @returns {string|*}
     */
    getName() {
        return `${this.type}.${this.name}`;
    }


    //noinspection JSAnnotator
      /**
       *
       * @param context
       * @param ops
       * @param cachedResult (optional) if set, will not perform query, but use that result
       * @returns {Promise}
       */
    async eval(context, ops) {
            try {
                const processedArgs = this.getProcessedArgs(context);

                const materialValuePayload = await this.performFunction(processedArgs, context, ops);
                return await this.continueTree(context, ops, materialValuePayload);

            } catch (e) {
                throw `Error in ${this.getName()}: ${e}`;
            }
        
    }

    async performFunction(processedArgs, context, ops) {
      //Determine material node type and materialize itself
      const MaterialClass = supportedTypes[this.type];
      const materialNode = new MaterialClass(this.getName(), this.children, processedArgs);

      return await materialNode.eval(context, ops);
    }

  /**
   * Appends payload from function node to context and continues tree execution
   * @param materialNode
   * @param context
   * @param ops
   * @param payload
   * @returns {Promise.<*>}
   */
    async continueTree(context, ops, payload) {
      //Create context and add payload to it
      let ctx = Object.assign({}, context);
      ctx[this.getName()] = payload;

      //Process down the tree...
      if(typeof payload === 'string') {
        return await (new LeafNode(this.getName())).eval(ctx);
      } else if(typeof payload === 'object') {
          let innerContext = createMixedContext(context, {
              [this.getName()] : payload
          });
        // let innerContext = Object.assign({}, context);
        // innerContext[this.getName()] =  payload;

        let innerNode = new CompositeNode(this.getName(), this.children);

        return await innerNode.eval(innerContext, ops);

      } else { //"You don't het another chance, life ain't a Nintendo game" - Eminem
        throw `APIError: got invalid data type ${typeof payload} which is not supported by function nodes` ;
      }
    }
}

FunctionNode.recursiveReplace = recursiveReplace;
FunctionNode.getFromContext = getFromContext;
FunctionNode.quoted = quoted;
FunctionNode.removeQuotes = removeQuotes;

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