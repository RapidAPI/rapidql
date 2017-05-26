/**
 * Created by iddo on 2/14/17.
 */
/**
 * Created by iddo on 12/19/16.
 */
"use strict";
const RapidAPI = require('rapidapi-connect'),
    LeafNode = require('./../../LeafNode'),
    ObjectNode = require('./../../ObjectNode'),
    ArrayNode = require('./../../ArrayNode'),
    CompositeNode = require('./../../CompositeNode');

class RapidAPINode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    //noinspection JSAnnotator
    eval(context, ops) {
        //Init RapidAPI
        if (!ops.hasOwnProperty('RapidAPI')) {
            return new Promise((resolve, reject) => {reject(`OptionError: ops don't have RapidAPI keys`)});
        } else {

            const rapid = new RapidAPI(ops['RapidAPI']['projectName'], ops['RapidAPI']['apiKey']);
            return new Promise((resolve, reject) => {

                rapid.call(...this.getName().split('.').slice(1), this.args)
                    .on('success', (payload) => {
                        //If JSON and not parsed -> parse
                        try {
                            payload = JSON.parse(payload);
                        } catch (err) {
                            err = err;
                        } //Otherwise - no biggie, "you don't always get what you want" - M. Jagger
                        for (let k in payload) {
                            if(payload.hasOwnProperty(k))
                                if(typeof payload[k] == 'number')
                                    payload[k] = payload[k]+"";
                        }
                        resolve(payload);
                    })
                    .on('error', (err) => {
                        reject(`APIError: got error from ${this.getName()} API: ${err}`);
                    });
            });
        }

    }
}

module.exports = RapidAPINode;

//PLAYGROUND:

/*let fn = new RapidAPINode('GoogleTranslate.translate', [], {
 'apiKey': 'AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM',
 'string': 'hello world, what a great day',
 'targetLanguage': 'de'
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