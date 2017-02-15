/**
 * Created by iddo on 2/14/17.
 */

const SEP_CHAR = '.';

const pg = require('pg'),
    LeafNode = require('./../../LeafNode'),
    CompositeNode = require('./../../CompositeNode');

const functions = {
    select: require('./functions/select')
};

class PostgreSQLNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return "PostgreSQL." + this.name();
    }

    //noinspection JSAnnotator
    eval(context, ops) {

        return new Promise((resolve, reject) => {
            //De-tokenize function call: DBName.DBSchema.DBTable.operation
            const tokenizedName = this.name.split(SEP_CHAR);
            const DBName = tokenizedName[0],
                DBSchema = tokenizedName[1],
                DBTable = tokenizedName[2],
                operation = tokenizedName[3];

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
                    functions[operation](DBSchema, DBTable, client, args)
                        .then((payload) => {
                            //Add to context
                            let ctx = Object.assign({}, context);
                            ctx[this.getName()] = payload;
                            //Process down the tree...
                            if(typeof payload == 'string'){
                                (new LeafNode(this.getName())).eval(ctx).then(resolve).catch(reject);
                            } else if(typeof payload == 'object') {
                                let innerContext = Object.assign({}, context);
                                innerContext[this.getName()] =  payload;

                                let innerNode = new CompositeNode(this.getName(), this.children);

                                innerNode.eval(innerContext, ops).then(resolve).catch(reject);

                            } else { //"You don't het another chance, life ain't a Nintendo game" - Eminem
                                reject(`APIError: got invalid data type ${typeof payload} which is not supported by function nodes`);
                            }
                        })
                        .catch(reject);

                });
            }
        });
    }
}