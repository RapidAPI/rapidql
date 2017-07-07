/**
 * Created by iddo on 6/23/17.
 */

const insertClauseGenerator = require('./../insertGenerator').insertClauseGenerator;

module.exports = (DBSchema, DBTable, client, args) => {
    let queryString = insertClauseGenerator(DBSchema, DBTable, args);

    queryString += ' RETURNING *;';

    return new Promise((resolve, reject) => {
        client.query(queryString, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result.rows || []);
            }
        });
    });
};