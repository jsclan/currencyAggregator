/**
 * Created by G on 18.07.2017.
 */
const moment = require('moment');

const timeInterval = function(){
  const dateFrom = moment().utc().startOf('day').format('YYYY-MM-DD 00:00:00');
  const dateTo = moment().utc().endOf('day').format('YYYY-MM-DD 23:59:59');
  return { dateFrom, dateTo };
};

exports.CurrencyStore = function(){
    this.collection = 'CurrencyStore';
    this.mongo = global.core.db.mongo;
    this.model = null;
    this.__construct();
    return this;
};
exports.CurrencyStore.prototype.__construct = function(){
  const self = this;
  const Schema = self.mongo.mongoose.Schema;
  const ObjectId = Schema.ObjectId;
  self.model = self.mongo.connection.model(self.collection, new Schema({
    source: String,
    currency: String,
    ask: Number,
    bid: Number,
    date: String
  }), self.collection);
};
exports.CurrencyStore.prototype.getAll = function(){
  const self = this;
  const CurrencyStore = self.model;
  return new Promise((resolve, reject) => {
    CurrencyStore.find({}).lean().exec(function(err, result){
        if ( err ) {
            reject(err);
        } else {
          resolve(result);
        }
    });
  })
};
exports.CurrencyStore.prototype.getAllByCurrency = function(currency = null, dateFilter = null){
  const self = this;
  const CurrencyStore = self.model;
  return new Promise((resolve, reject) => {
    const { dateFrom, dateTo } = timeInterval();
    const filter = {
      date: {
        '$gte': dateFrom,
        '$lte': dateTo
      }
    };
    if ( dateFilter !== null ) {
      if (typeof dateFilter === 'object') {
        filter.date['$gte'] = moment(dateFilter.dateFrom).format('YYYY-MM-DD 00:00:00');
        filter.date['$lte'] = moment(dateFilter.dateTo).format('YYYY-MM-DD 23:59:59');
      }
      if (typeof dateFilter === 'string') {
        filter.date['$gte'] = moment(dateFilter).format('YYYY-MM-DD 00:00:00');
        filter.date['$lte'] = moment(dateFilter).format('YYYY-MM-DD 23:59:59');
      }
    }
    if ( currency ) {
        filter['currency'] = currency.toUpperCase();
    }
    CurrencyStore.find(filter).lean().exec(function(err, result){
        if ( err ) {
            reject(err);
        } else {
          resolve(result);
        }
    });
  })
};