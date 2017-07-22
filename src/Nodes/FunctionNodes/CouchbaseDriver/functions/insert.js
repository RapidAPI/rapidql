const queryString = require("../utils/queryStringGenerator");
const N1qlQuery = require('couchbase').N1qlQuery;
const uuidv1 = require("uuid/v1");

module.exports = (bucket, db, { docid = uuidv1(), data = {} }) => {
    return new Promise((resolve, reject) => {
        const statement = `INSERT INTO ${bucket} ( KEY, VALUE ) VALUES ( "${docid}", ${JSON.stringify(data)} ) RETURNING META(default).id, default.*`;
        const query = N1qlQuery.fromString(statement);
        db.query(query, (error, result) => {
            if (error) return reject(error);
            return resolve(result[0]);
        });
    });
};
