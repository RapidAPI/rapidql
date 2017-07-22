/**
 * Created by iddo on 7/7/17.
 */
const whereGenerator = require('./../whereGenerator').whereGenerator;
const setClauseGenerator = require('./../updateGenerator').setClauseGenerator;

module.exports = (DBSchema, DBTable, client, args) => {
    let queryString = "";

    queryString += `UPDATE \`${DBSchema}\`.\`${DBTable}\``;

    if(args.hasOwnProperty('SET')) {
        queryString += setClauseGenerator(args['SET']);
    }

    //Add where conditions
    queryString += whereGenerator(args);

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