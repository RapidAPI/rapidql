/**
 * Created by iddo on 3/1/17.
 */

const whereGenerator = require('./../whereGenerator').whereGenerator;

function count(DBSchema, DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //GROUP BY
    //If we're grouping, we want to select the group name as well
    let coloumns = "";
    if (typeof args['GROUPBY'] == 'string') {
        coloumns += `, ${args['GROUPBY']}`;
    }

    //Base query
    queryString += `SELECT COUNT(*) ${coloumns} FROM ${DBSchema}.${DBTable}`;

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

module.exports = count;