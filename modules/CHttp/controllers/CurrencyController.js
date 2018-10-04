/**
 * Created by G on 13.08.2018.
 */
'use strict';

const CHttpHelper = require(global.CHTTP_DIR + '/helpers/CHttpHelper').CHttpHelper;
const CurrencyStore = require(global.COREMODELS_DIR + '/CurrencyStore').CurrencyStore;
const TYPE_AVG = 'AVG';
const prepareAVGResponseBody = (currencies, type) => {
  const responseBody = { type };
  const tmp = { };
  let total = 0;
  for ( let i in currencies ) {
    let currencyItem = currencies[i];
    if ( !tmp.hasOwnProperty(currencyItem.currency) ) {
      total++;
      tmp[currencyItem.currency] = {ask : currencyItem.ask, bid : currencyItem.bid, total: 1};
    } else {
      tmp[currencyItem.currency].total++;
      tmp[currencyItem.currency].ask += currencyItem.ask;
      tmp[currencyItem.currency].bid += currencyItem.bid;
    }
  }
  for ( let currency in tmp ) {
    responseBody[currency] = {
      ask: tmp[currency].ask / tmp[currency].total,
      bid: tmp[currency].bid / tmp[currency].total
    }
  }

  return { responseBody, total };
};
exports.todayAction = function(req, res) {
  const CurrencyStoreModel = new CurrencyStore;
  const currency = (req.params.hasOwnProperty('currency')) ? req.params.currency : null;
  CurrencyStoreModel.getAllByCurrency(currency).then((currencies) => {
    const { responseBody, total } = prepareAVGResponseBody(currencies, TYPE_AVG);

    CHttpHelper.success(200).body({
      data: responseBody,
      total: total
    }).applyTo(res);
  }).catch((err) => {
    CHttpHelper.error(err, 500).applyTo(res);
  });
};