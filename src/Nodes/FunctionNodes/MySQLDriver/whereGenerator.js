const specialKeys = ['WHERE', 'LIMIT', 'ORDERBY', 'SKIP', "GROUPBY"];

/**
 * This function takes query arguments and turns them into a PostgreSQL WHERE clause
 * @param queryArgs
 */
function whereGenerator(args) {
    let queryString = "";

    //Check if full query / shorthand
    let queryArgs ;
    if (args.hasOwnProperty('WHERE') && typeof args['WHERE'] == 'object')
        queryArgs = Object.assign({},args['WHERE']);
    else
        queryArgs = Object.assign({},args);

    //Remove special instructions (LIMIT, SKIP, ETC...)
    specialKeys.forEach((key) => {
        delete queryArgs[key];
    });

    //WHERE clause
    if (Object.keys(queryArgs).length > 0) {
        queryString += ` WHERE`;
        //Has one is set to true after first condition is added, to append the AND keyword
        let hasOne = false;
        for (let field in queryArgs) {
            if (queryArgs.hasOwnProperty(field)) {
                if (hasOne)
                    queryString += ` AND`;

                //Simple equality operator
                if (typeof queryArgs[field] == 'string' || typeof queryArgs[field] == 'number') {
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

    //GROUP BY clause
    if (typeof args['GROUPBY'] == 'string') { //Shorthand
        queryString += ' GROUP BY ' + args['GROUPBY'];
    }

    //ORDER BY clause
    if (typeof args['ORDERBY'] == 'string') { //Shorthand, ASC by default
        queryString += ' ORDER BY ' + args['ORDERBY'];
    } else if (typeof args['ORDERBY'] == 'object') { //Full syntax
        let first = true; //after the first need to add a ,
        queryString += ' ORDER BY';
        for (let field in args['ORDERBY']) {
            if(args['ORDERBY'].hasOwnProperty(field)) {
                if (typeof args['ORDERBY'][field] == 'string') {
                    if (args['ORDERBY'][field] == 'ASC' || args['ORDERBY'][field] == 'DESC') { //Never do it without protection....
                        if (!first)
                            queryString += ',';
                        queryString += ` ${field} ${args['ORDERBY'][field]}`;
                        first = false;
                    }
                }
            }
        }
    }

    //LIMIT clause
    if (typeof args['LIMIT'] == 'string') {
        queryString += ' LIMIT ' + args['LIMIT'];
    }

    //SKIP clause
    if (typeof args['SKIP'] == 'string') {
        queryString += ' SKIP ' + args['SKIP'];
    }

    return queryString;
}

module.exports = whereGenerator;