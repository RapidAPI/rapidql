/**
 * Created by iddo on 2/14/17.
 */

function find(DBSchema, DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //Base query
    queryString += `SELECT * FROM ${DBSchema}.${DBTable} WHERE`;

    //Add where conditions
    for (let field in args) {
        if (args.hasOwnProperty(field)) {
            if (typeof args[field] == 'string') {
                queryString += ` ${field} = "${args[field]}"`
            }
        }
    }

    client.query(queryString, (err, result) => {
        return new Promise((resolve, reject) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

module.exports = find;