/**
 * Created by Iddo on 12/17/2016.
 */

const   WQLQuery = require('./src/WQLQuery'),
        LeafNode = require('./src/LeafNode'),
        ObjectNode = require('./src/ObjectNode');

/*
{
    foo
    foo1
    obj {
        a
        b
        obj2 {
            d
        }
    }
}
 */
let roots = [
    new LeafNode('foo'),
    new LeafNode('foo1'),
    new ObjectNode('obj', [
        new LeafNode('a'),
        new LeafNode('b'),
        new ObjectNode('obj2', [
            new LeafNode('d')
        ])
    ])
];

let context = {
    'foo' :     'bar',
    'foo1' :    'bar1',
    'obj' :     {
        'a':1,
        'b':2,
        'obj2': {
            'c':3,
            'd':4
        }
    }
};

let q = new WQLQuery(roots);

let res = q.eval(context);

console.log(JSON.stringify(res));