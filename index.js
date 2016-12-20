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
        l,
        GoogleTranslate.translate(apiKey = "AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM", string = l, target="de")
    },
    arrSim,
    SpotifyPublicAPI.getArtist (id="7dGJo4pcD2V6oG8kP0tJRR") {
        name,
        popularity,
        followers {
            total
        },
        SpotifyPublicAPI.getArtistRelatedArtists (id= id) {
            name
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
    ]),
    new ArrayNode('arr', [
        new LeafNode('l'),
        new FunctionNode('GoogleTranslate.translate', {
            'apiKey': '"AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM"',
            'string': 'l',
            'targetLanguage': '"de"'
        }, [])
    ]),
    new ArrayNode('arrSim'),
    /*new FunctionNode('SpotifyPublicAPI.getArtist', {
        'id': '"7dGJo4pcD2V6oG8kP0tJRR"'
    }, [
        new LeafNode('name'),
        new LeafNode('popularity'),
        new ObjectNode('followers', [
            new LeafNode('total')
        ])
    ]),*/
    new FunctionNode('SpotifyPublicAPI.getArtistRelatedArtists', {
        'id' : '"7dGJo4pcD2V6oG8kP0tJRR"'
    }, [
        new ArrayNode("artists", [
            new LeafNode("name")
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
    },
    'arr' :     [
        {'k':1, 'l': 'Hello'},
        {'k':2, 'l': 'World'},
        {'k':3, 'l': 'Country'},
        {'k':4, 'l': 'Water'}
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

