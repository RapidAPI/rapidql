/**
 * Created by Iddo on 12/17/2016.
 */

const   WQLQuery = require('./src/WQLQuery'),
        LeafNode = require('./src/LeafNode');

/*
{
    foo
    foo1
}
 */
let roots = [
    new LeafNode('foo'),
    new LeafNode('foo1')
];

let context = {
    'foo' :     'bar',
    'foo1' :    'bar1'
};

let q = new WQLQuery(roots);

let res = q.eval(context);

console.log(JSON.stringify(res));