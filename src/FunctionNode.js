/**
 * Created by iddo on 12/19/16.
 */
const RapidAPI = require('rapidapi-connect'),
    LeafNode = require('./LeafNode'),
    ObjectNode = require('./ObjectNode'),
    ArrayNode = require('./ArrayNode');

class FunctionNode {
    constructor(name, args, children) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    eval(context, ops) {
        //Init RapidAPI
        if (!ops.hasOwnProperty('RapidAPI')) {
            return new Promise((resolve, reject) => {reject(`OptionError: ops don't have RapidAPI keys`)});
        } else {
            const rapid = new RapidAPI(ops['RapidAPI']['projectName'], ops['RapidAPI']['apiKey']);
            return new Promise((resolve, reject) => {
                rapid.call(...this.getName().split('.'), this.args)
                    .on('success', (payload) => {
                        //If JSON -> parse
                        try {
                            payload = JSON.parse(JSON);
                        } catch (err) {

                        }
                        //Create context and add payload to it
                        let ctx = Object.assign({}, context);
                        ctx[this.getName()] = payload;
                        //Process down the tree...
                        if(typeof payload == 'string'){
                            (new LeafNode(this.getName())).eval(ctx).then(resolve).catch(reject);
                        }
                    })
                    .on('error', (err) => {
                        reject(`APIError: got error from ${this.getName()} API: ${err}`);
                    });
            });
        }
        
    }
}

module.exports = FunctionNode;

//PLAYGROUND:

/*let fn = new FunctionNode('GoogleTranslate.translate', {
    'apiKey': 'AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM',
    'string': 'hello world, what a great day',
    'targetLanguage': 'de'
}, []);

let ops = {
    RapidAPI : {
        projectName : 'Iddo_demo_app_1',
        apiKey: '4c6e5cc0-8426-4c95-9e3b-60adba0e50f6'
    }
};

fn.eval({}, ops)
    .then((res) => {console.log(JSON.stringify(res))})
    .catch((err) => {console.warn(JSON.stringify(err))});*/