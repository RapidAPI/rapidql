/**
 * Created by Iddo on 12/17/2016.
 */


const WQL = require('./src/WQL');

let wql = new WQL({
    RapidAPI : {
        projectName : 'Iddo_demo_app_1',
        apiKey: '4c6e5cc0-8426-4c95-9e3b-60adba0e50f6'
    }
});

/*wql.query(`
{
    foo,
    arr {
        k,
        GoogleTranslate.translate(apiKey = "AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM", string = l, targetLanguage="de")
    }
}
`, {
    'foo' :     'bar',
    'foo1' :    'bar1',
    'arr' :     [
        {'k':1, 'l': 'Hello'},
        {'k':2, 'l': 'World'},
        {'k':3, 'l': 'Country'},
        {'k':4, 'l': 'Water'}
    ]
}).then(console.log).catch((err) => {console.warn(err)});*/

function pipe(...funcs) {
    return function(values) {
        return funcs.reduce(function(vals, f) {
            return f(vals);
        }, values);
    }
}

//Get friends and their profile pics
/*wql.query(`
{
    FacebookGraphAPI.getUsersFriends(access_token="EAACEdEose0cBAFMrjdYxDXuVe9l0GikZCZBrsuyxZAmESDVMFymr1cCqhEGbdm7Jqo2U5lGm2SH0YelSwLxv2JsUE9seyyjdynJqb0tZCQ30WsvhWZATF0ZA8b8WkjzGKWiGS5Tb8kAeGmH7gPkdeZCyxIZCmp9UBZBWcxbFw9ZAzV5wZDZD", user_id = "me") {
        data {
             name,
             FacebookGraphAPI.getProfilePicture(profile_id=id, access_token="EAACEdEose0cBAFMrjdYxDXuVe9l0GikZCZBrsuyxZAmESDVMFymr1cCqhEGbdm7Jqo2U5lGm2SH0YelSwLxv2JsUE9seyyjdynJqb0tZCQ30WsvhWZATF0ZA8b8WkjzGKWiGS5Tb8kAeGmH7gPkdeZCyxIZCmp9UBZBWcxbFw9ZAzV5wZDZD"){
                data {
                    url
                }
             }
        }
    }

}
`).then(pipe(JSON.stringify, console.log)).catch((err) => {console.warn(err)});*/

//Get images from Instagram and then process with AWS Rekognition
wql.query(`
{
    Instagram.getUsersRecentMedia(userId="self", accessToken="175826345.49afbf0.885ac554935e45ac9f83d811e870211c") {
        data {
            caption {
                text
            },
            images {
                standard_resolution {
                    url,
                    AWSRekognition.detectLabelsInImage(image=url, apiKey="AKIAJELI5PIGECVCLS2Q", apiSecret = "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") {
                        Labels {
                            Name,
                            Confidence
                        }
                    }
                }
            }
        }
    }
}
`).then(pipe(JSON.stringify, console.log)).catch((err) => {console.warn(err)});


/*const parser = require('./src/Parser/Parser'),
    WQLQuery = require('./src/WQLQuery');

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

parser.parse(`
{
    foo,
    foo1
}
`).then((roots) => {
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
}).catch((err) => {
    console.warn(err);
});
*/





/** const   WQLQuery = require('./src/WQLQuery'),
        LeafNode = require('./src/Nodes/LeafNode'),
        ObjectNode = require('./src/Nodes/ObjectNode'),
        ArrayNode = require('./src/Nodes/ArrayNode'),
        FunctionNode = require('./src/Nodes/FunctionNode'),
        CompositeNode = require('./src/Nodes/CompositeNode');


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

let roots = [
    new LeafNode('foo'),
    new LeafNode('foo1'),
    new CompositeNode('obj', [
        new LeafNode('a'),
        new LeafNode('b'),
        new ObjectNode('obj2', [
            new LeafNode('d')
        ])
    ]),
    new CompositeNode('arr', [
        new LeafNode('l'),
        new FunctionNode('GoogleTranslate.translate', {
            'apiKey': '"AIzaSyCDogEcpeA84USVXMS471PDt3zsG-caYDM"',
            'string': 'l',
            'targetLanguage': '"de"'
        }, [])
    ]),
    new ArrayNode('arrSim'),
    new FunctionNode('SpotifyPublicAPI.getArtist', {
        'id': '"7dGJo4pcD2V6oG8kP0tJRR"'
    }, [
        new LeafNode('name'),
        new LeafNode('popularity'),
        new ObjectNode('followers', [
            new LeafNode('total')
        ]),
        new FunctionNode('SpotifyPublicAPI.getArtistRelatedArtists', {
            'id' : 'id'
        }, [
            new ArrayNode("artists", [
                new LeafNode("name")
            ])
        ])
    ])
];/**


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

**/