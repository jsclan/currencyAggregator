/**
 * Created by G on 24.07.2018.
 */
'use strict';

module.exports = function(app) {
    var ejs = require('ejs');
    var auth = require(global.CHTTP_DIR + '/auth/auth');
    app.set('view engine', 'html');
    app.engine('.html', ejs.renderFile);
    app.set('views', global.CHTTP_DIR + '/views');
};