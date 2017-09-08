/**
 * Created by iddo on 7/21/17.
 */

const whereGenerator = require('./../whereGenerator');

function sum(DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //GROUP BY
    //If we're grouping, we want to select the group name as well
    let coloumns = "";
    if (typeof args['GROUPBY'] == 'string') {
        coloumns += `, ${args['GROUPBY']}`;
    }

    if (!args['FIELD'])
        return new Promise((resolve, reject) => {reject(`MySQL: to use the .sum() function, must supply FIELD to sum`)});

    //Base query
    queryString += `SELECT SUM(${args['FIELD']}) as ${args['FIELD']} ${coloumns} FROM \`${DBTable}\``;

    //Add where conditions
    queryString += whereGenerator.whereGenerator(args);

    return new Promise((resolve, reject) => {
        client.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result || []);
            }
        });
    });

}

module.exports = sum;
