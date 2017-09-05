const queryString = require("../utils/queryStringGenerator");
const N1qlQuery = require("couchbase").N1qlQuery;

module.exports = (bucket, db, { WHERE, KEY }) => {
  return new Promise((resolve, reject) => {
    const whereStr = WHERE ? `WHERE ${queryString(WHERE)}` : "";
    const keyStr = KEY ? `USE KEYS "${KEY}"` : "";
    const statement = [whereStr, keyStr].reduce((acc, str) => {
      return acc += ` ${str || ""}`;
    }, `SELECT COUNT(*) AS COUNT FROM ${bucket}`);
    const query = N1qlQuery.fromString(statement);
    db.query(query, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    });
  });
};
