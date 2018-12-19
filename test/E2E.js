/**
 * Created by iddo on 7/14/17.
 */
const RapidQL = require('./../index');

const rql = new RapidQL({
    RapidAPI : {
        projectName : 'Demo',
        apiKey: 'e0e4f9cc-c076-4cae-ad5b-f5d49beacd8a'
    },
    PostgreSQL: {
        local:{
            "user":"iddo",
            "database":"postgres",
            "password":null,
            "host":"localhost",
            "port":5432
        }
    },
    Http: {
        rateLimit: {count:250, period:1000} // Limits to 250 requests per 1000 seconds
    }
});

const assert = require("assert");

// describe('E2E API Queries', function () {
//     this.timeout(10000);
//     it('should run', async () => {
//         let r = await rql.query(`
//         {
//             res:RapidAPI.NasaAPI.getPictureOfTheDay() {
//                 explanation,
//                 title,
//                 pic_url:url,
//                 ? randomFieldThatShouldBeNull
//             }
//         }
//         `, {});
//         assert.equal(r.hasOwnProperty('RapidAPI.NasaAPI.getPictureOfTheDay'), false);
//         assert.equal(r.hasOwnProperty('res'), true);
//         assert.equal(r.res.hasOwnProperty('explanation'), true);
//         assert.equal(r.res.hasOwnProperty('title'), true);
//         assert.equal(r.res.hasOwnProperty('pic_url'), true);
//         assert.equal(r.res.randomFieldThatShouldBeNull, null);
//     });
// });