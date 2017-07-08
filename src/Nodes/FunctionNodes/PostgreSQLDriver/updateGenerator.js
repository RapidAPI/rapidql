/**
 * Created by iddo on 7/7/17.
 */
const quoteAsNeeded = require('./utils').quoteAsNeeded;

function setClauseGenerator(args) {
    let queryString = '';
    if(Object.keys(args).length > 0) {
        queryString += ' SET ';
        queryString += Object.entries(args) //Get entries [[k1,v1],[k2,v2]]
            .map(p=>[p[0], quoteAsNeeded(p[1])]) //Quote values
            .map(p => p.join(" = ")) //Join into "k1 = v1"
            .join(", "); //Join with comma separated
    }
    return queryString;
}

module.exports.setClauseGenerator = setClauseGenerator;