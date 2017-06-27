/**
 * Created by iddo on 2/14/17.
 */

const SEP_CHAR = '.';

const pg = require('pg'),
    LeafNode = require('./../../LeafNode'),
    CompositeNode = require('./../../CompositeNode');

const functions = {
    find: require('./functions/find'),
    count: require('./functions/count'),
    insert: require('./functions/insert')
};

class PostgreSQLNode {
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
        const self = this;

        return new Promise((resolve, reject) => {
            //De-tokenize function call: DBName.DBSchema.DBTable.operation
            const tokenizedName = this.name.split(SEP_CHAR);
            const DBName = tokenizedName[1],
                DBSchema = tokenizedName[2],
                DBTable = tokenizedName[3],
                operation = tokenizedName[4];

            //Check operation exists
            if(!functions.hasOwnProperty(operation))
                return reject(`Operation Error: operation ${operation} does not exist / is not supported`);

            //Create DB connection
            //Check configs exist
            if (!ops.hasOwnProperty('PostgreSQL')) {
                return reject(`Missing configs: PostgreSQL settings are missing`);
            } else if (!ops['PostgreSQL'].hasOwnProperty(DBName)) {
                return reject(`Missing configs: PostgreSQL settings for DB ${DBName} are missing`);
            } else {
                const DBConfigs = ops.PostgreSQL[DBName];

                const pool = new pg.Pool(DBConfigs);

                pool.connect(function(err, client, done) {
                    if (err) {
                        return reject(`DB Error: Error connecting to database ${DBName} -> ${err}`);
                    }

                    //Route different functions
                    functions[operation](DBSchema, DBTable, client, self.args)
                        .then((payload) => {
                            resolve(payload);
                        })
                        .catch(reject);

                });
            }
        });
    }
}

module.exports = PostgreSQLNode;