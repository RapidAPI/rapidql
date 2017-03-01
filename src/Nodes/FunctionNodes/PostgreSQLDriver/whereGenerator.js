/**
 * This function takes query arguments and turns them into a PostgreSQL WHERE clause
 * @param queryArgs
 */
function whereGenerator(queryArgs) {
    let queryString = "";

    //Add where conditions
    if (Object.keys(queryArgs).length > 0) {
        queryString += ` WHERE`;
        //Has one is set to true after first condition is added, to append the AND keyword
        let hasOne = false;
        for (let field in queryArgs) {
            if (queryArgs.hasOwnProperty(field)) {
                if (hasOne)
                    queryString += ` AND`;

                //Simple equality operator
                if (typeof queryArgs[field] == 'string') {
                    queryString += ` ${field} = '${queryArgs[field]}'`

                //Complex inequalities
                } else if (typeof queryArgs[field] == 'object') {
                    //If comparators have quotes - remove
                    const compOp = Object.keys(queryArgs[field])[0];
                    const compVal = queryArgs[field][Object.keys(queryArgs[field])[0]];
                    queryString += ` ${field} ${compOp} ${compVal}`;
                }
                hasOne = true;
            }
        }
    }

    return queryString;
}

module.exports = whereGenerator;