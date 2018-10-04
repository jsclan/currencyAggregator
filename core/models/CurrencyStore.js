/**
 * Created by G on 18.07.2017.
 */
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
    date: Number
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
exports.CurrencyStore.prototype.getAllByCurrency = function(currency = null){
  const self = this;
  const CurrencyStore = self.model;
  return new Promise((resolve, reject) => {
    const filter = {};
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