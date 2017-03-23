#!/usr/bin/env node
/**
 * Created by iddo on 3/13/17.
 */

const CONFIG_FILE_NAME = ".rqlconfig",
    CONTEXT_FILE_NAME = ".rqlcontext";

const fs = require('fs'),
    RQL = require('./../index');

let configs = {}, baseContext = {};

//Try and read configs
fs.readFile(CONFIG_FILE_NAME, 'utf8', function(err, data) {
    if(!err && data) {
        try {
            configs = JSON.parse(data);
        } catch (e) {
            throw `Error reading config file: ${e}`;
        }
    }
    //Try and base context
    fs.readFile(CONTEXT_FILE_NAME, 'utf8', function(err, data) {
        if(!err && data) {
            try {
                baseContext = JSON.parse(data);
            } catch (e) {
                throw `Error reading context file: ${e}`;
            }
        }

        //Read query
        if (process.argv.length < 3)
            throw  `Please provide query file`;
        const queryFile = process.argv[2];
        fs.readFile(queryFile, 'utf8', function (err, queryString) {
            if (err) {
                throw `Error reading query file: ${err}`;
            } else if (!data) {
                throw  `Query file empty`;
            } else {
                //Perform query
                const rqlClient = new RQL(configs);
                rqlClient.query(queryString, baseContext)
                    .catch((err) => {
                        console.warn(`Error performing query: \n${e}`);
                    })
                    .then((res) => {
                        console.log(JSON.stringify(res, null, 4));
                        process.exit(0)
                    });
            }
        });

    });
});