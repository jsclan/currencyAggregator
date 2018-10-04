/**
 * Created by G on 24.07.2018.
 */
'use strict';

function Core(){
  global.CHTTP_DIR = global.ROOT_DIR + '/modules/CHttp';
  global.CORE_DIR = global.ROOT_DIR + '/core';
  global.COREMODELS_DIR = global.CORE_DIR + '/models';
  global.CHTTPVIEWS_DIR = global.CHTTP_DIR + '/views';

  const self = this;
  const _config = require(global.CORE_DIR + '/constants/06b2d3b23dce96e1619d2b53d6c947ec');

  this.config = (function (config) {
    return config;
  })(_config);

  this.db = {
    mongo: {
      connection: null,
      mongoose: null
    }
  };
  this.framework = null;
  this.frameworkLib = null;

  return new Promise(function(resolve, reject) {
    self.loadMongo().then(function(){
      self.loadApplicationComponents();
    }).then(function(){
      resolve(self);
    });
  });
};

Core.prototype.loadApplicationComponents = function(){
  this.frameworkLib = require('express');
  this.framework = this.frameworkLib();
  return this;
};

Core.prototype.loadMongo = function(){
  const self = this;
  self.db.mongo.mongoose = require('mongoose');

  return new Promise(function(resolve, reject){
    self.db.mongo.connection = self.db.mongo.mongoose.createConnection('mongodb://' +
      self.config.db.mongo.user + ':' +
      self.config.db.mongo.pass + '@' +
      self.config.db.mongo.host + '/' +
      self.config.db.mongo.db + '?authSource=' +
      self.config.db.mongo.authDb + '&authMechanism=' +
      self.config.db.mongo.authMechanism, function(err, res){
      if (err) {
        reject(err);
        console.log ('MongoDb: ERROR connecting: ' + err);
      } else {
        resolve();
        console.log ('MongoDb: Connected');
      }
    });
  });
};

module.exports = Core;