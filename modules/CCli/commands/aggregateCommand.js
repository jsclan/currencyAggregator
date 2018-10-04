/**
 * Created by G on 02.10.2018.
 */
const CurrencyStore = require(global.COREMODELS_DIR + '/CurrencyStore').CurrencyStore;

exports.aggregateCommand = function(forced) {
  this.forced = (forced !== undefined) ? forced : false;
}

exports.aggregateCommand.prototype.all = async function() {
  const drivers = require('./drivers');

  for ( let i in drivers ) {
    const driver = new drivers[i](CurrencyStore);
    const { error, data } = await driver.aggregate();
  }
};