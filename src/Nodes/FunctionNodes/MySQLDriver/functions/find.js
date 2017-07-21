/**
 * Created by iddo on 3/10/17.
 */
const whereGenerator = require('./../whereGenerator');


function find(DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //Base query
    queryString += `SELECT * FROM \`${DBTable}\``;

    //Add where conditions
    queryString += whereGenerator(args);

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

module.exports = find;