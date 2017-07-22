const queryString = require("../utils/queryStringGenerator");
const N1qlQuery = require('couchbase').N1qlQuery;
const uuidv1 = require("uuid/v1");

module.exports = (bucket, db, { KEY, WHERE, SET }) => {
    return new Promise((resolve, reject) => {
        const whereStr = WHERE ? `WHERE ${queryString(WHERE)}` : "";
        const keyStr = KEY ? `USE KEYS "${KEY}"` : "";
        const setStr = `SET ${queryString(SET)}`;
        const statement =
            [keyStr, setStr, whereStr, `RETURNING ${bucket}.*`].reduce((acc, str) => {
                return acc += ` ${str || ""}`;
            }, `UPDATE ${bucket}`);
        const query = N1qlQuery.fromString(statement);
        db.query(query, (error, result) => {
            if (error) return reject(error);
            return resolve(result[0]);
        });
    });
};
