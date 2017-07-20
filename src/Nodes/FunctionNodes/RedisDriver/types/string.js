/**
 * Created by iddo on 7/19/17.
 */

const getArg = require('./../utils').getArg;

function get(client, key) {
    return new Promise((resolve, reject) => {
        client.get(key, (err, data) => {
            if (err)
                reject(`Redis error getting key ${key}: ${err}`);
            else
                resolve({value:data});
        });
    });
}
module.exports.get = async (client, args) => {
    return await get(client, await getArg(args, 'key'));
};

function set(client, key, value) {
    return new Promise((resolve, reject) => {
        client.set(key, value, (err, data) => {
            if (err)
                reject(`Redis error setting key ${key} with value ${value}: ${err}`);
            else
                resolve(data);
        });
    });
}
module.exports.set = async (client, args) => {
    return await set(client, await getArg(args, 'key'), await getArg(args, 'value'));
};