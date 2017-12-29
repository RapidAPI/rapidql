/**
 * Created by iddo on 5/25/17.
 */

const SEP_CHAR = '.';
const NODE_NAME = 'HttpNode';
const OBJECT_TYPE = 'object';

const   _request = require('request'),
        queryString = require("query-string");
const limit = require("simple-rate-limiter");

global.request = null;
function getRequestClient(ops) {
    if (global.request !== null)
        return global.request;

    if (ops.hasOwnProperty('Http')) {
        if (ops.Http.hasOwnProperty('rateLimit')) {
            if (ops.Http.rateLimit.hasOwnProperty('count') && ops.Http.rateLimit.hasOwnProperty('period')) {
                global.request = limit(_request).to(ops.Http.rateLimit.count).per(ops.Http.rateLimit.period);
                return getRequestClient(ops);
            }
        }
    }

    global.request = _request;
    return getRequestClient(ops);

}

const functions = {
    get: null,
    post: null,
    put: null
};

class HttpNode {
    constructor(name, children, args) {
        this.name = name;
        this.args = args;
        this.children = children;
    }

    getName() {
        return `${this.name}`;
    }

    eval(context, ops) {
        const self = this;

        return new Promise((resolve, reject) => {
            const tokenizedName = this.name.split(SEP_CHAR);
            const operation = tokenizedName[1];

            if(!functions.hasOwnProperty(operation))
                return reject(`Operation Error: operation ${operation} does not exist / is not supported`);

            const   params      = self.args['params'] || {},
                    url         = `${(self.args['url'] || "")}${Object.keys(params).length ? "?" : ""}${queryString.stringify(params)}`,
                    body        = (operation === 'get') ? (null) : (self.args['body'] || {}),
                    form        = (operation === 'get') ? (null) : (self.args['form'] || null),
                    json        = (operation === 'get') ? (null) : (self.args['json'] || null),
                    headers     = self.args['headers'] || {},
                    bearer      = self.args['bearer'] || null,
                    basic       = self.args['basic'] || null;


            if (bearer !== null) {
                headers['Authorization'] = `Bearer ${bearer}`;
            }

            if (basic !== null) {
                headers['Authorization'] = `Basic ${new Buffer(basic['username'] + ":" + basic['password']).toString("base64")}`;
            }

            getRequestClient(ops)(url, {
                method      : operation,
                headers     : headers,
                body        : body,
                form        : form,
                json        : json
            }, (error, response, body) => {
                if (error)
                    return reject(`HttpError: got error from ${url}: ${error}`);

                if(!response)
                    return reject(`HttpError: no response from ${url}`);

                if(response.statusCode > 299)
                    return reject(`HttpError: got non-2xx response from ${url}: \ncode: ${response.statusCode}, \ncontent: ${response}`);

                if(typeof body !== OBJECT_TYPE) {
                    try {
                        return resolve(JSON.parse(body));
                    } catch (e) {
                        return resolve({body:body});
                    }
                }

                return resolve(body);
            });
        });
    }
}

module.exports = HttpNode;