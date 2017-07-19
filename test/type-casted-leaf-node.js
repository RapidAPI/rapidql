/**
 * Created by iddo on 7/14/17.
 */
"use strict";

const assert = require("assert");
const LeafNode = require("../src/Nodes/LeafNode");
const CastedLeafNode = require("../src/Nodes/CastedLeafNode");

describe("CastedLeafNode", () => {
    it("should throw error on unsupported type cast", (done) => {
        try {
            let a = new CastedLeafNode("DumbUnsupportedType", new LeafNode("a"));
            done("Didn't throw error");
        } catch (e) {
            done();
        }
    });

    it('shouldnt throw error on supported type casts, and be case insensitive', () => {
        for (let t in CastedLeafNode.typeConverters) {
            let a;
            if (CastedLeafNode.typeConverters.hasOwnProperty(t)) {
                a = new CastedLeafNode(t, new LeafNode("a"));
                a = new CastedLeafNode(t.toLowerCase(), new LeafNode("a"));
                a = new CastedLeafNode(t.toUpperCase(), new LeafNode("a"));
            }
        }
    });

    it('should convert types on eval - int', async () => {
        let i = await (new CastedLeafNode('int', new LeafNode("a"))).eval({a:"12"});
        assert.equal(i, 12);

        i = await (new CastedLeafNode('int', new LeafNode("a"))).eval({a:-12});
        assert.equal(i, -12);
    });

    it('should convert types on eval - float', async () => {
        let i = await (new CastedLeafNode('float', new LeafNode("a"))).eval({a:"12.5"});
        assert.equal(i, 12.5);

        i = await (new CastedLeafNode('float', new LeafNode("a"))).eval({a:-12.01});
        assert.equal(i, -12.01);
    });

    it('should convert types on eval - date', async () => {
        let i = await (new CastedLeafNode('date', new LeafNode("a"))).eval({a:"2017-01-01"});
        assert.equal(i.getTime(), (new Date("2017-01-01")).getTime());
    });
});

describe("CastedLeafNode.typeConverters", () => {

    describe("int", () => {
        const converter = CastedLeafNode.typeConverters.int;

        it('should return ints as is', () => {
            assert.equal(converter(1),1);
            assert.equal(converter(0),0);
            assert.equal(converter(-1),-1);
        });

        it('should return floored floats', () => {
            assert.equal(converter(1.5),1);
            assert.equal(converter(1.2),1);
            assert.equal(converter(-1.2),-1);
        });

        it('should parse strings', () => {
            assert.equal(converter("1.2"),1);
            assert.equal(converter("1"),1);
            assert.equal(converter("-1"),-1);
        });

        it('should throw error on invalid strings', (done) => {
            try {
                converter("This is not a string"); //aka 'this is not a pipe'
                converter("SupraorbitalGland");
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid type - object', (done) => {
            try {
                converter({a:'b'}); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid type - boolean', (done) => {
            try {
                converter(true);
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid type - array', (done) => {
            try {
                converter(['0', 0, '7']);
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

    });

    describe("float", () => {
        const converter = CastedLeafNode.typeConverters.float;

        it('should return floats as is', () => {
            assert.equal(converter(1),1.0);
            assert.equal(converter(0),0);
            assert.equal(converter(-1),-1);
            assert.equal(converter(-1.6),-1.6);
        });

        it('should parse strings', () => {
            assert.equal(converter("1.2"),1.2);
            assert.equal(converter("1"),1);
            assert.equal(converter("-1"),-1);
        });

        it('should throw error on invalid strings', (done) => {
            try {
                converter("This is not a string"); //aka 'this is not a pipe'
                converter("SupraorbitalGland");
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid types - object', (done) => {
            try {
                converter({a:'b'}); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid types - boolean', (done) => {
            try {
                converter(true);
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw error on invalid types - array', (done) => {
            try {
                converter(['0', 0, '7']);
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

    });

    describe("date", () => {
        const converter = CastedLeafNode.typeConverters.date;

        it('should convert dates', () => {
            assert.equal(converter(1).getTime(),(new Date(1)).getTime());
            assert.equal(converter("2017-01-01").getTime(),(new Date("2017-01-01")).getTime());
        });

        it('should throw an error on invalid types - invalid string', (done) => {
            try {
                converter("This is not a string"); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw an error on invalid types - object', (done) => {
            try {
                converter({a:'b'}); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw an error on invalid types - boolean', (done) => {
            try {
                converter(true); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });

        it('should throw an error on invalid types - arrau', (done) => {
            try {
                converter(['0', 0, '7']); //aka 'this is not a pipe'
                done(`Didn't throw an error`);
            } catch(e) {
                done();
            }
        });
    });

});