/**
 * Created by iddo on 7/27/17.
 */
const { expect, assert } = require('chai');
const HttpNode = require('./../HttpNode');

module.exports = () => {
    describe('get request', () => {
        it('should perform simple get request', async () => {
            let n = new HttpNode('Http.get', [], {
                url: "https://httpbin.org/get",
                params: {
                    a: "b",
                    c: 1
                }
            });

            let res = await n.eval({}, {});
            assert.equal(res.args.a, "b");
            assert.equal(res.args.c, 1);
        });

        it("should properly send headers", async () => {
            let n = new HttpNode('Http.get', [], {
                url: "https://httpbin.org/get",
                headers: {
                    "X-Test": "b"
                }
            });

            let res = await n.eval({}, {});
            assert.equal(res.headers["X-Test"], "b");
            assert.equal(res.headers["Host"], "httpbin.org");
        })
    });

    describe('post request', () => {
        it('should send form data', async () => {
            let n = new HttpNode('Http.post', [], {
                url: "https://httpbin.org/post",
                form: {
                    a: "b",
                    c: 1
                }
            });

            let res = await n.eval({}, {});
            assert.equal(res.form.a, "b");
            assert.equal(res.form.c, 1);
            assert.equal(res.json, null);
            assert.equal(res.url, "https://httpbin.org/post");
        });

        it('should send json data', async () => {
            let n = new HttpNode('Http.post', [], {
                url: "https://httpbin.org/post",
                json: {
                    a: "b",
                    c: 1
                }
            });

            let res = await n.eval({}, {});
            assert.equal(res.json.a, "b");
            assert.equal(res.json.c, 1);
            assert.equal(res.url, "https://httpbin.org/post");
        });
    });
};