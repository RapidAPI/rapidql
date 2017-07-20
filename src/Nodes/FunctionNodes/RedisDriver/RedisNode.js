/**
 * Created by iddo on 7/19/17.
 */
const SEP_CHAR = '.';

const redis = require("redis");

global._redis_clients = {};
function getClient(DBName, DBConfig) {
    if (global._redis_clients.hasOwnProperty(DBName))
        return global._redis_clients[DBName];
    else {
        global._redis_clients[DBName] = redis.createClient(DBConfig);
        return getClient(DBName, DBConfig);
    }
}


// Types:
const string = require('./types/string');
const hash = require('./types/hash');
const generic = require('./types/generic');
const functions = {
    get                 : string.get,
    set                 : string.set,
    hmset                 : hash.hmset,
    hgetall             : hash.hgetall,
    type                : generic.type,
    find                : generic.find
};



class RedisNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return this.name;
    }

    async eval(context, ops) {
        const self = this;

        const tokenizedName = this.name.split(SEP_CHAR);
        const DBName = tokenizedName[1],
            operation = tokenizedName[2];

        //Check operation exists
        if (!functions.hasOwnProperty(operation))
            throw `Operation Error: operation ${operation} does not exist / is not supported`;


        //Create DB connection
        //Check configs exist
        if (!ops.hasOwnProperty('Redis')) {
            throw `Missing configs: Redis settings are missing`;
        } else if (!ops['Redis'].hasOwnProperty(DBName)) {
            throw `Missing configs: Redis settings for DB ${DBName} are missing`;
        } else {
            const DBConfigs = ops['Redis'][DBName];

            const client = getClient(DBName, DBConfigs);

            //Route different functions
            const res = await functions[operation](client, self.args);
            return res;
        }
    }
}

module.exports = RedisNode;