/**
 * Created by G on 08.08.2017.
 */
'use strict';

module.exports = function(app) {
  const auth = require(global.CHTTP_DIR + '/auth/auth');
  const CurrencyController = require(global.CHTTP_DIR + '/controllers/CurrencyController');

  app.get('/currency', auth.checkAccessorApi, CurrencyController.todayAction);
  app.get('/currency/:currency', auth.checkAccessorApi, CurrencyController.todayAction);
  app.get('/currency/bydate/:date', auth.checkAccessorApi, CurrencyController.periodAction);
  app.get('/currency/byperiod/:dateFrom/:dateTo', auth.checkAccessorApi, CurrencyController.periodAction);
  app.get('/currency/:currency/bydate/:date', auth.checkAccessorApi, CurrencyController.periodAction);
  app.get('/currency/:currency/byperiod/:dateFrom/:dateTo', auth.checkAccessorApi, CurrencyController.periodAction);
    //auth.checkAccessorApi
};