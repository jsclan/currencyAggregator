/**
 * Created by G on 02.10.2018.
 */
'use strict';

global.ROOT_DIR = __dirname;
const _core = require('./core/core.js');
new _core().then(function(core){
  global.core = core;

  const mongo = global.core.db.mongo;
  const framework = core.framework;

  const CHttpApp = require(global.CHTTP_DIR + '/CHttpApp.js');
  new CHttpApp(framework);
}).catch(function(e){
  console.log(e);
});