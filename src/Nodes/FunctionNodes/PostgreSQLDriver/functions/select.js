/**
 * Created by iddo on 2/14/17.
 */

const whereGenerator = require('./../whereGenerator');

function find(DBSchema, DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //Base query
    queryString += `SELECT * FROM ${DBSchema}.${DBTable}`;

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

module.exports = find;