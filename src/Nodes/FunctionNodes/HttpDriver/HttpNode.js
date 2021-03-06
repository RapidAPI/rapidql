/**
 * Created by iddo on 5/25/17.
 */

const SEP_CHAR = '.';
const NODE_NAME = 'HttpNode';
const OBJECT_TYPE = 'object';

const   _request = require('request'),
        queryString = require("query-string");
const limit = require("simple-rate-limiter");

const dns = require('dns'),
  dnscache = require('dnscache')({
    "enable" : true,
    "ttl" : 360000,
    "cachesize" : 1000
  });




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
    put: null,
    delete: null
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

    get signature() {
        return `Http.${this.operation.toUpperCase()} - ${this.urlWithParameters}`;
    }

    get queryParameters() {
        return this.args['params'] || {}
    }

    get urlWithParameters() {
        return `${(this.args['url'] || "")}${Object.keys(this.queryParameters).length ? "?" : ""}${queryString.stringify(this.queryParameters)}`;
    }

    get tokenizedName() {
        return this.name.split(SEP_CHAR);
    }

    get operation() {
        return this.tokenizedName[1];
    }

    eval(context, ops) {

        const self = this;

        return new Promise((resolve, reject) => {
            const tokenizedName = this.tokenizedName;
            const operation = this.operation;

            // ops.Http is default HTTP parameters
            // self.args is patameters at time of call
            if(ops.Http === undefined)
                ops.Http = {};
            if(!ops.Http.headers)
                ops.Http.headers = {};
                

            if(self.args === undefined)
                self.args = {};

            if(!functions.hasOwnProperty(operation))
                return reject(`Operation Error: operation ${operation} does not exist / is not supported`);

            const   params      = self.queryParameters,
                    url         = self.urlWithParameters,
                    body        = (operation === 'get') ? (null) : (self.args['body'] || ""),
                    form        = (operation === 'get') ? (null) : (self.args['form'] || null),
                    json        = (operation === 'get') ? (null) : (self.args['json'] || null),
                    headers     = { ...ops.Http['headers'], ...self.args['headers'] } || {},
                    bearer      = (self.args['bearer']) ? self.args['bearer'] : ops.Http['bearer'] || null,
                    basic       = (self.args['basic']) ? self.args['basic'] : ops.Http['basic'] || null,
                    stopOnError = self.args.hasOwnProperty('stopOnError') ? self.args['stopOnError'] : true;

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

                if(response.statusCode > 299 && stopOnError)
                    return reject(`HttpError: got non-2xx response from ${url}: \ncode: ${response.statusCode}, \ncontent: ${response}, \nmessage: ${body}`);

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