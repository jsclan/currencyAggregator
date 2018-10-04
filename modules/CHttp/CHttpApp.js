/**
 * Created by G on 24.07.2018.
 */
function CHttpApp(app) {
    this.expressApp = app;
    this.runHttpInstance();
}

CHttpApp.prototype.runHttpInstance = function(){
  const self = this;
  const bodyParser = require('body-parser');
  //const session = require('express-session');
  //const cookieParser = require('cookie-parser');
  const webRoutes = require(global.CHTTP_DIR + '/routes/webRoute');
  const apiRoutes = require(global.CHTTP_DIR + '/routes/apiRoute');
  const staticRoutes = require(global.CHTTP_DIR + '/routes/staticRoute')(self.expressApp);

  const guid = function() {
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  };

  /*self.expressApp.use(session({
    genid: function(req) {
      return guid();
    },
    cookie: {
      maxAge: 36000000,
      secure: false,
      httpOnly: false
    },
    secret: 'aezakmi',
    resave: false,
    saveUninitialized: false
  }));
  self.expressApp.use(cookieParser());*/

  self.expressApp.use(bodyParser.urlencoded({extended: true}));
  self.expressApp.use(bodyParser.json());
    /*self.expressApp.use(function(req, res, next){
     CComponent.requestPatch(req, res, next);
     var authId = (req.session.hasOwnProperty('authId')) ? req.session.authId : null;
     if ( typeof req == 'object' && req.hasOwnProperty('route') ) {
     if (req.route.hasOwnProperty('path')) {
     CEventProvider.emit('route:usage', {
     route: req.route.path,
     session: authId
     });
     }
     }
     });*/


  const server = self.expressApp.listen(global.core.config.tcp.http.port, function() {
    console.log('WEB APP: ' + global.core.config.tcp.http.host + ':' + global.core.config.tcp.http.port);
  });

  server.setTimeout(10*60*1000);

  apiRoutes(self.expressApp);
  webRoutes(self.expressApp);
  //crudRoutes(self.expressApp);
};

module.exports = CHttpApp;