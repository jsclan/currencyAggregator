/**
 * Created by G on 17.08.2017.
 */
const moment = require('moment');
const authAttempts = {
  clients: {},
  tick: 0
};
setInterval(function(){
  let utcDate = moment.utc();
  let nowTime = utcDate.format('HHmmss');
  if ( parseInt(nowTime) == 235959 ) {
    authAttempts.clients = {};
    authAttempts.tick = 0
  }
}, 1000);
setInterval(function(){
  authAttempts.tick += 100;
}, 100);
const quotaCheck = function(authKey){
  const authKeys = global.core.config.tcp.http['auth-keys'];
  if ( authAttempts.clients.hasOwnProperty(authKey)) {
    if ( authKeys[authKey].quota !== null ) {
      if ( authAttempts.clients[authKey].attempts === authKeys[authKey].quota.attempts ) {
        return false;
      }
      if ( (authAttempts.tick - authAttempts.clients[authKey].tick) > authKeys[authKey].quota.delay ) {
        authAttempts.clients[authKey].tick = authAttempts.tick;
        authAttempts.clients[authKey].attempts++;
        return true;
      }
    } else {
      return true;
    }
  } else {
    authAttempts.clients[authKey] = {
      tick: authAttempts.tick,
      attempts: 1
    };
    return true;
  }
  return false;
}
exports.checkAccessorApi = function(req, res, next) {

    const CHttpHelper = require(global.CHTTP_DIR + '/helpers/CHttpHelper').CHttpHelper;
    const authKeys = global.core.config.tcp.http['auth-keys'];

    if (req.headers.hasOwnProperty('auth-key')) {
        const authKey = req.headers['auth-key'].toLowerCase();
        if (authKeys.hasOwnProperty(authKey)) {
          if ( quotaCheck(authKey) ) {
            next();
          } else {
            CHttpHelper.error('Quota exceeded', 401).applyTo(res);
          }
        } else {
            CHttpHelper.error('Authorization required', 401).applyTo(res);
        }
    } else {
        CHttpHelper.error('Authorization required', 401).applyTo(res);
    }
};

exports.checkAccessorWeb = function(req, res, next) {
    var CHttpHelper = require(global.CHTTP_DIR + '/helpers/CHttpHelper').CHttpHelper;

    var SystemUser = require(global.COREMODELS_DIR + '/SystemUser.js').SystemUser;
    var SystemUsers = new SystemUser();

    /*SystemUsers.addUser({
        _id: '123sd',
        email: 'testEmail',
        firstName: 'Viktor',
        lastName: 'G.',
        password: 'e10adc3949ba59abbe56e057f20f883e'
        authOnline: false,
        authIp: '',
        authHash: ''
    }, function(err, res){
        console.log(err, res);
    });*/

    //SystemUsers.getAll(console.log);
    //CComponent.rebuildConfig();

    if ( req.session.authKey && req.session.authId ) {
        next();
    } else {
        res.redirect('/login');
    }

    //CHttpHelper.error('Authorisation required 2', 401).applyTo(res);
};

exports.checkAccessorDataScenario = function(req, res, next) {
    var CHttpHelper = require(global.CHTTP_DIR + '/helpers/CHttpHelper').CHttpHelper;

    var SystemUser = require(global.COREMODELS_DIR + '/SystemUser.js').SystemUser;
    var SystemUsers = new SystemUser();

    if ( req.session.authKey && req.session.authId ) {
        next();
    } else {
        CHttpHelper.error('Not permitted to access on this area', 401).applyTo(res);
    }

    //CHttpHelper.error('Authorisation required 2', 401).applyTo(res);
};

exports.authenticate = function(email, password) {
    var crypto = require('crypto');

    var SystemUser = require(global.COREMODELS_DIR + '/SystemUser.js').SystemUser;
    var SystemUsers = new SystemUser();

    var hash = crypto.createHash('md5').update(password).digest('hex');

    return new Promise(function(resolve, reject) {
        SystemUsers.getProfile({
            email: email,
            password: hash
        }).then(function(result){
            resolve(result);
        }).catch(function(err){
            reject((err) ? err : 'Not found');
        });
        /*SystemUsers.findOne({
            email: email,
            password: hash
        }).exec(function(err, result){
            if ( err == null && result != null ) {
                resolve(result);
            } else {
                reject((err) ? err : 'Not found');
            }
        });*/
    });
};

exports.logIn = function(req, systemUser, emulated) {
    emulated = (emulated == true);
    var crypto = require('crypto');

    var SystemUser = require(global.COREMODELS_DIR + '/SystemUser.js').SystemUser;
    var SystemUsers = new SystemUser().model;

    var authHash = crypto.createHash('md5').update(('0.0.0.0' + systemUser['_id'])).digest('hex');

    return new Promise(function(resolve, reject) {
        SystemUsers.updateOne({
            '_id' : systemUser['_id']
        }, {
            '$set': {
                authOnline: true,
                authIp: '0.0.0.0',
                authHash: authHash
            }
        }, {
            multi: false
        }, function(err, result){
            if ( !err ) {
                req.session.authKey = authHash;
                req.session.authId = systemUser['_id'];
                req.session.user = {
                    email: systemUser.email,
                    firstName: systemUser.firstName,
                    lastName: systemUser.lastName,
                    permissions: []
                };
                req.session.save(function(_err){
                    if ( !_err ) {
                        resolve();
                    } else {
                        reject(_err);
                    }
                });
            } else {
                reject(err);
            }
        });
    });
};