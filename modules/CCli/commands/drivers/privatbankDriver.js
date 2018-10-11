/**
 * Created by G on 03.10.2018.
 */

const moment = require('moment');

const timeNow = function(){
  return moment().utc().format('YYYY-MM-DD hh:mm:ss');
};
const https = require('https');
const TARGET_ENDPOINT = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';

class privatbankDriver {
  constructor(CurrencyStore){
    this.CurrencyStore = CurrencyStore;
  }
  aggregate(){
    let chunkBuff = '';
    const resultObject = {
      data: null,
      error: null
    };
    return new Promise((resolve, reject) => {
      https.get(TARGET_ENDPOINT, (response) => {
        response.on('data', (chunk) => {
          chunkBuff += chunk;
        });
        response.on('end', () => {
          resultObject.data = JSON.parse(chunkBuff);
          const totalItems = resultObject.data.length;
          let addedIndex = 0;
          for ( let i in resultObject.data ) {
            const currencyItem = resultObject.data[i];
            const CurrencyStoreModel = new this.CurrencyStore();
            console.log(currencyItem)
            CurrencyStoreModel.model.create({
              source: 'PRIVATBANK',
              currency: currencyItem.ccy.toUpperCase(),
              ask: parseFloat(currencyItem.buy),
              bid: parseFloat(currencyItem.sale),
              date: timeNow()
            }, (err, result) => {
              addedIndex++;
              if ( addedIndex > 0 && addedIndex == totalItems ) {
                resolve(resultObject);
              }
            });
          }
          if ( totalItems == 0 ) {
            resolve(resultObject);
          }
        });
      }).on('error', (error) => {
        resultObject.error = error;
        reject(resultObject);
      });
    })
  }
}

module.exports = privatbankDriver;