/**
 * Created by Iddo on 12/17/2016.
 */

const   WQLQuery = require('./src/WQLQuery'),
        LeafNode = require('./src/LeafNode'),
        ObjectNode = require('./src/ObjectNode'),
        ArrayNode = require('./src/ArrayNode'),
        FunctionNode = require('./src/FunctionNode');

/*
{
    foo,
    foo1,
    obj {
        a,
        b,
        obj2 {
            d,
        }
    },
    arr {
        k
    },
    arrSim
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
    ]),
    new ArrayNode('arr', [
        new LeafNode('l'),
        new FunctionNode('GoogleTranslate.translate', {
            'apiKey': 'AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM',
            'string': 'hello world, what a great day',
            'targetLanguage': 'de'
        }, [])
    ]),
    new ArrayNode('arrSim')
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
    },
    'arr' :     [
        {'k':1, 'l': 11},
        {'k':2, 'l': 12},
        {'k':3, 'l': 13},
        {'k':4, 'l': 14}
    ],
    'arrSim' :  [
        "hello",
        "world",
        "from",
        "strings"
    ]
};


let ops = {
    RapidAPI : {
        projectName : 'Iddo_demo_app_1',
        apiKey: '4c6e5cc0-8426-4c95-9e3b-60adba0e50f6'
    }
};

let q = new WQLQuery(roots, ops);

q.eval(context)
    .then((res) => {
        console.log(JSON.stringify(res));
    })
    .catch((error) => {
        console.warn(error);
    });

