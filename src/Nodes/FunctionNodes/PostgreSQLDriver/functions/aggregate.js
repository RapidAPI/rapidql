/**
 * Created by iddo on 7/21/17.
 */

const whereGenerator = require('./../whereGenerator').whereGenerator;

function aggregate(DBSchema, DBTable, client, args, aggregateFunction) {
    //We'll build the SQL query with that string
    let queryString = "";

    //GROUP BY
    //If we're grouping, we want to select the group name as well
    let coloumns = "";
    if (typeof args['GROUPBY'] == 'string') {
        coloumns += `, ${args['GROUPBY']}`;
    }

    if (!args['FIELD'])
        return new Promise((resolve, reject) => {reject(`PostgreSQL: to use the ${aggregateFunction}() aggregate function, must supply FIELD to aggregate`)});

    //Base query
    queryString += `SELECT ${aggregateFunction.toUpperCase()}(${args['FIELD']}) as ${args['FIELD']} ${coloumns} FROM ${DBSchema}.${DBTable}`;

    //Add where conditions
    queryString += whereGenerator(args);

    return new Promise((resolve, reject) => {
        client.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows || []);
            }
        });
    });

}

module.exports = (aggregateFunction) => {
    return function (DBSchema, DBTable, client, args) {
        return aggregate(DBSchema, DBTable, client, args, aggregateFunction);
    }
};