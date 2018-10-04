/**
 * Created by G on 24.07.2018.
 */
'use strict';

exports.loginAction = function(req, res) {
    res.render('login', { title: 'The index page!' })
};
exports.authenticateAction = function(req, res) {
    const auth = require(global.CHTTP_DIR + '/auth/auth');

    if ( req.body.hasOwnProperty('authenticate') ) {
      const postData = req.body.authenticate;
      const email = postData.email;
      const password = postData.password;

      if ( email && password ) {
        auth.authenticate(email, password).then(function(systemUser){
          auth.logIn(req, systemUser, false).then(function(){
            res.redirect('/dashboard');
          }).catch(function(err){
            res.redirect('/login');
          });
        }).catch(function(err){
          res.redirect('/login');
        });
      } else {
        res.redirect('/login');
      }
    } else {
        res.redirect('/login');
    }
};