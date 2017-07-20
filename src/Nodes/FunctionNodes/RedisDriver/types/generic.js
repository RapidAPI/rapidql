/**
 * Created by iddo on 7/19/17.
 */


const string = require('./string'),
    hash = require('./hash');

function getType(client, key) {
    return new Promise((resolve, reject) => {
        client.type(key, (err, data) => {
            if (err)
                reject(`Redis error getting type for key ${key}: ${err}`);
            else
                resolve(data);
        });
    });
}
module.exports.type = (client, args) => {
    return getType(client, args['key']);
};

module.exports.find = async (client, args) => {
    // Preflight type check
    const type = await getType(client, args['key']);

    if (type === 'string')
        return await string.get(client, args);
    else if (type === 'hash')
        return await hash.hgetall(client, args);
    else
        throw `Redis operation find not supported on type ${type}`;
};