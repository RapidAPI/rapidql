/**
 * Created by iddo on 1/28/18.
 */
const program = require('commander');
const { readFile, readJsonFile } = require('./utils');
const RQL = require('./../index');

program
  .option('--stdin-context', 'Stream context in stdin')
  .option('--parse-context [format]', "Format of context", "json")
  .option('--context-file [file]', "File to read context fromh. Defaults to .rqlcontext", ".rqlcontext")
  .option('--config-file [file]', "File to read configurations from. Defaults to .rqlconfig", ".rqlconfig")
  .option('-f, --query-file', "Argument is a file to read query from, rather than the query itself")
  .parse(process.argv);

async function getContext() {
  let contextData;
  if (!program.stdinContext) {
    contextData = await readFile(program.contextFile);
  }

  if (program.parseContext.toLowerCase() === "json") {
    return JSON.parse(contextData);
  }

  if (program.parseContext.toLowerCase() === "csv") {
    const rqlClient = new RQL({});
    // feeding like a mad dog
    return await rqlClient.query(`{ csv:Csv.read(file:csvFile){} }`, {
      csvFile :  program.contextFile
    });
  }
}

async function getConfig() {
  return await readJsonFile(program.configFile);
}

async function getQueryString() {
  let query = program.args[0];

  if (program.queryFile) {
    return await readFile(query);
  } else {
    return query;
  }
}

async function execQuery() {
  const context = await getContext();
  const config = await getConfig();
  let query = await getQueryString();

  const rqlClient = new RQL(config);

  const result = await rqlClient.query(query, context);

  return JSON.stringify(result, null, 4);
}

execQuery().then(console.log).catch(console.warn);

// samples:
// rql query --context-file=data.csv --parse-context=csv --query-file q4.rql