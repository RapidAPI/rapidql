/**
 * Created by iddo on 2/14/17.
 */

function find(DBSchema, DBTable, client, args) {
    //We'll build the SQL query with that string
    let queryString = "";

    //Base query
    queryString += `SELECT * FROM ${DBSchema}.${DBTable}`;

    //Add where conditions
    if (Object.keys(args).length > 0) {
        queryString += ` WHERE`;
        for (let field in args) {
            if (args.hasOwnProperty(field)) {
                if (typeof args[field] == 'string') {
                    queryString += ` ${field} = '${args[field]}'`
                }
            }
        }
    }

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