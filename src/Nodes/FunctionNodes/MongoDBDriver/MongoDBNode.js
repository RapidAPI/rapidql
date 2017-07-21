/**
 * Created by iddo on 7/19/17.
 */
const SEP_CHAR = '.';

const MongoClient = require('mongodb').MongoClient;

const functions = {
    find: require('./functions/find')
};

global._mongodb_clients = {};
function getClient(DBName, DBConfigs) {
    return new Promise((resolve, reject) => {
        if (global._mongodb_clients.hasOwnProperty(DBName))
            resolve(global._mongodb_clients[DBName]);
        else
            MongoClient.connect(DBConfigs, (err, db) => {
                if (err)
                    reject(`MongoDB: Connection error: ${err}`);
                else {
                    global._mongodb_clients[DBName] = db;
                    resolve(global._mongodb_clients[DBName]);
                }
            });
    });
}

class MongoDBNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    //noinspection JSAnnotator
    async eval(context, ops) {
        const self = this;

        const tokenizedName = this.name.split(SEP_CHAR);
        // MongoDB.local.users.find()
        const DBName = tokenizedName[1],
            DBTable = tokenizedName[2],
            operation = tokenizedName[3];

        if(!functions.hasOwnProperty(operation))
            throw `Operation Error: operation ${operation} does not exist / is not supported`;

        //Create DB connection
        //Check configs exist
        if (!ops.hasOwnProperty('MongoDB')) {
            throw `Missing configs: MongoDB settings are missing`;
        } else if (!ops['MongoDB'].hasOwnProperty(DBName)) {
            throw `Missing configs: MongoDB settings for DB ${DBName} are missing`;
        } else {
            const DBConfigs = ops['MongoDB'][DBName];

            const db = await getClient(DBName, DBConfigs);

            //Route different functions
            return await functions[operation](DBTable, db, self.args);
        }
    }
}

module.exports = MongoDBNode;