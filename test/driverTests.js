/**
 * Created by iddo on 2/16/17.
 */

/**
 * This is an ugly work around to run tests from specific DB Drivers in their folders.
 * There's probably a better solution but since I'm on a plane with no Wi-Fi I'll stick to that for now.
 */

describe('PostgreSQL Driver', ()=> {
    require('./../src/Nodes/FunctionNodes/PostgreSQLDriver/test/whereGenerator')();
    require('./../src/Nodes/FunctionNodes/PostgreSQLDriver/test/utils')();
    require('./../src/Nodes/FunctionNodes/PostgreSQLDriver/test/insertGenerator')();
});