/**
 * Created by iddo on 1/28/18.
 */

const fs = require('fs');

/**
 * Reads and parses JSON in a file. Returns empty object if file empty
 * @param filename
 * @returns {Promise}
 */
function readJsonFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err)
        return reject(`Error reading JSON file ${filename} : ${err}`);
      else if (!data)
        return resolve({});

      try {
        return resolve(JSON.parse(data));
      } catch (e) {
        return reject(`Error parsing JSON in file ${filename} : ${e}`);
      }
    });
  });
}
module.exports.readJsonFile = readJsonFile;

function readFile(filename) {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', function(err, data) {
      if (err)
        return reject(`Error reading file ${filename} : ${err}`);
      else if (!data)
        return reject(`File ${filename} is empty`);
      else
        return resolve(data);
    });
  });
}

module.exports.readFile = readFile;