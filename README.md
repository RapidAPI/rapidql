![](http://imgur.com/download/qSQWBoE)

**RapidQL** let's developer query multiple API resources at a time, combining them to create 1 unified Query.

##Initialization

After requiring the RapidQL package, you can initialize it. You may also pass options, such as RapidAPI credentials.

    const RapidQL = require('RapidQL');
    let rql = new RapidQL({
        RapidAPI : {
            projectName : '########',
            apiKey: '##########'
        }
    });

##Querying

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


##Sample queries

Get images from Instagram and then process with AWS Rekognition

    rql.query(`
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


Get friends and their profile pics

    rql.query(`
    {
        FacebookGraphAPI.getUsersFriends(user_id = "me", access_token="EAACEdEose0cBAMf2uam36XJ5NZByqoq3cwiYacIba3eDkgkMhQ6kVqWbg5zLXw2LgAkZAgYQA9qRZAcYGVP527AHXakDDnF38YOZAZBnQDTQZCmKlG8ZCOFBDSZABdllBteFzzgnBFCQihxO3Vl7wuwZBrXvXLJ61JvaYWVpqoqTDcwZDZD") {
            data {
                 name,
                 FacebookGraphAPI.getProfilePicture(profile_id=id, access_token="EAACEdEose0cBAMf2uam36XJ5NZByqoq3cwiYacIba3eDkgkMhQ6kVqWbg5zLXw2LgAkZAgYQA9qRZAcYGVP527AHXakDDnF38YOZAZBnQDTQZCmKlG8ZCOFBDSZABdllBteFzzgnBFCQihxO3Vl7wuwZBrXvXLJ61JvaYWVpqoqTDcwZDZD"){
                    data {
                        url
                    }
                 }
            }
        }
    }
    `).then(pipe(JSON.stringify, console.log)).catch(console.warn);
