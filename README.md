**RapidQL** let's developer query multiple API resources at a time, combining them to create 1 unified Query.

[![](https://circleci.com/gh/iddogino/rapidql.svg?style=shield&circle-token=70838eabb9e7255c543594d9c12d44db3e9b979e)](https://circleci.com/gh/iddogino/rapidql)

## Installation
    npm install https://github.com/iddogino/rapidql.git -g

The `-g` flag is necessary to run from command line (see bellow).

## Initialization

After requiring the RapidQL package, you can initialize it. You may also pass options, such as RapidAPI credentials.

    const RapidQL = require('RapidQL');
    let rql = new RapidQL({
        RapidAPI : {
            projectName : '########',
            apiKey: '##########'
        }
    });

## Querying

You can perform queries using the method rql.query(). It takes 2 arguments:

1. The query string
2. *[optional]* A base context. You may use the base context for parameter passing (any parameters such as user name used in the query should be passed through the base context. The query string should be completely static).

Queries return promises. If the promise rejects, the returned value will be the error message. If the query resolves, the returned value will be the query result.

    //Running this query on this base context will return the object {a:1}
    rql.query(`
    {
        a
    }
    `, {
        a: 1,
        b: 2
    }).then(console.log).catch(console.warn);


## Sample queries

Get images from Instagram and then process with AWS Rekognition

    rql.query(`
    {
        Instagram.getUsersRecentMedia(userId:"self", accessToken:"175826345.49afbf0.885ac554935e45ac9f83d811e870211c") {
            data {
                caption {
                    text
                },
                images {
                    standard_resolution {
                        url,
                        AWSRekognition.detectLabelsInImage(image:url, apiKey:"AKIAJELI5PIGECVCLS2Q", apiSecret : "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") {
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


Get friends and their profile pics

    rql.query(`
    {
        FacebookGraphAPI.getUsersFriends(user_id : "me", access_token:"EAACEdEose0cBAMf2uam36XJ5NZByqoq3cwiYacIba3eDkgkMhQ6kVqWbg5zLXw2LgAkZAgYQA9qRZAcYGVP527AHXakDDnF38YOZAZBnQDTQZCmKlG8ZCOFBDSZABdllBteFzzgnBFCQihxO3Vl7wuwZBrXvXLJ61JvaYWVpqoqTDcwZDZD") {
            data {
                 name,
                 FacebookGraphAPI.getProfilePicture(profile_id:d, access_token:"EAACEdEose0cBAMf2uam36XJ5NZByqoq3cwiYacIba3eDkgkMhQ6kVqWbg5zLXw2LgAkZAgYQA9qRZAcYGVP527AHXakDDnF38YOZAZBnQDTQZCmKlG8ZCOFBDSZABdllBteFzzgnBFCQihxO3Vl7wuwZBrXvXLJ61JvaYWVpqoqTDcwZDZD"){
                    data {
                        url
                    }
                 }
            }
        }
    }
    `).then(pipe(JSON.stringify, console.log)).catch(console.warn);


## DB Queries
RapidQL may also be used for querying databases. Database queries and API queries may be combined to create advance data gathering logic.

### Set Up
To add a database connection to your rql instance, you need to add it's connection details in the RapidQL initialization:

    const RapidQL = require('RapidQL');
    const rql = new RapidQL({
            PostgreSQL: {
                        Sample: {
                            user: 'admin', //required
                            database: 'compose', //required
                            password: '#########', //required
                            host: 'aws-us-east-1-portal.23.dblayer.com', // required
                            port: 17052, //required
                            max: 10, // optional - max connections
                            idleTimeoutMillis: 30000 // optional - how long a client is allowed to remain idle before being closed
                        }
            }
    });

Once the RapidQL instance is connected to the DB, you may query it. The object you're querying will have the following schema:

    DBType.DBName.Schema.Table.Operation

Where:

- **DBType** : the type of DB you're querying (PostgreSQL, MySQL, Redis, etc...)
- **DBName** : the name you used when in configuring the DB (as you can be connected to multiple DBs of each type)
- **Schema** : the schema you wish to work with
- **Table** : name of the table to be queried

For example, `PostgreSQL.Sample.public.users.select` will query the `Sample` PostgreSQL DB (same sample we used in configuration above), and perform a `select` query on the `users` table in the `public` schema.

### Select
The most basic way to perform select queries is by passing equality comparisons:

    PostgreSQL.Sample.public.users.select(location: "US")

This will find all users where location is 'US'.

For more complex conditions use:

    PostgreSQL.Sample.public.users.select(birthyear: {"<=": "1997"})

This will find users whose birth year is smaller than or equal to 1997. Using `.select(location:"US") is shorthand for .select(location:{"=":"US"})` You can have multiple conditions, mixing between comparison styles:

    PostgreSQL.Sample.public.users.select(location: 'US', birthyear: {"<=": "1997"})

### Complex queries (SKIP, LIMIT, ORDER BY)

`PostgreSQL.Sample.public.users.select(location: "US")` is shorthand for `PostgreSQL.Sample.public.users.select(WHERE:{"location": "US"})`. Using the full syntax you may add skip, limit and order by clauses.

    PostgreSQL.Sample.public.users.select(WHERE:{"location": "US"}, LIMIT:"3", SKIP:"1", ORDERBY: {birthyear:"DESC"})

Note case sensitivity.

### Count
Count works just like select, only it returns the `count` value.

    {
        PostgreSQL.GCELogs.public.blockcalls.count(LIMIT:"10", GROUPBY:"package", ORDERBY:{count:"DESC"}) {
            package,
            count
        }
    }

## Running in commandline
Install RapidQL from NPM with the `-g` flag to use from command line. Than, you can use:

    rql queryFile.rql

To run the query in `queryFile.rql`. RapidQL will also look for 2 optional hidden files:

- `.rqlconfig` - json file containing your configurations (DB / RpaidAPI connection details).
- `.rqlcontext` - base context for RQL (define variables used in the query).

## RQL Server
Install RapidQL from NPM with the `-g` flag to use from command line.
To use RQL from platforms other than nodejs, you can either use it as a command line executable (see above), or run it as a server. Running `rql-server` will set up an HTTP server, accepting RQL queries and returning their results in JSON format.

### Parameters:

- **-p** / **--port** : set the port rql will listen on. 3000 by default.
- **-c** / **--conf** : set the config file for rql to pull configurations from. By default - .rqlconfig at the same path.

### API:

Th