const SEP_CHAR = '.';

const couchbase = require('couchbase');

const functions = {
    find: require("./functions/find"),
    count: require("./functions/count")
};

global._couchbase_clients = {};
function getClient(DBConfigs) {
    return new Promise((resolve, reject) => {
        if (global._couchbase_clients.hasOwnProperty(DBConfigs.bucket)) {
            resolve(global._couchbase_clients[bucket]);
        } else {
            global._couchbase_clients = (new couchbase.Cluster(DBConfigs.url)).openBucket(DBConfigs.bucket);
            resolve(global._couchbase_clients);
        }
    });
}

class CouchbaseNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    //noinspect JSAnnotator
    async eval(context, opts) {
        const tokenizedName = this.name.split(SEP_CHAR);
        const [ dbtype, DBName, bucket, operation ] = tokenizedName;
        
        if (!functions.hasOwnProperty(operation)) {
            throw `Operation Error: operation ${operation} does not exist / is not supported`;
        }

        if (!opts.hasOwnProperty('Couchbase')) {
            throw `Missing configs: Couchbase settings are missing`;
        } else if (!opts['Couchbase'].hasOwnProperty(DBName)) {
            throw `Missing configs: Couchbase settings for DB ${DBName} are missing`;
        }
        const DBConfigs = opts['Couchbase'][DBName];
        const db = await getClient(bucket, DBConfigs);

        return await functions[operation](bucket, db, this.args);
    }
}

module.exports = CouchbaseNode;
