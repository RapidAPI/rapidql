/**
 * Created by iddo on 7/19/17.
 */

const getArg = require('./../utils').getArg;
const flattenObject = require('./../utils').flattenObject;

function hgetall (client, key) {
    return new Promise((resolve, reject) => {
        client.hgetall(key, (err, data) => {
            if (err)
                reject(`Redis error getting key ${args[key]}: ${err}`);
            else
                resolve(data);
        });
    });
}

module.exports.hgetall = async (client, args) => {
    return await hgetall(client, await getArg(args, 'key'));
};

function hmset (client, key, value) {
    return new Promise((resolve, reject) => {
        client.hmset(key, ...flattenObject(value), (err, data) => {
            if (err)
                reject(`Redis error setting key ${key}: ${err}`);
            else
                resolve(data);
        });
    });
}

module.exports.hmset = async (client, args) => {
    return await hmset(client, await getArg(args, 'key'), await getArg(args, 'value'));
};