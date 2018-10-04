/**
 * Created by G on 02.10.2018.
 */
'use strict';

global.ROOT_DIR = __dirname;
const _core = require('./core/coreCli.js');
new _core().then(function(core){
  global.core = core;
  const commander = global.core.commander;

  const mongo = global.core.db.mongo;
  const framework = core.framework;

  const CCliApp = require(global.CCLI_DIR + '/CCliApp.js');
  new CCliApp(commander);
}).catch(function(e){
  console.log(e);
});