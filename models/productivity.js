var mongoose = require('mongoose')
  , Schema = mongoose.Schema
;

var productivitySchema = new Schema({
  rating : { type: Number, required: true },
  name: { type: String, required: true, trim: true, index: { unique: true } },
  description: { type: String, trim: true }
});

var productivity = mongoose.model('productivity', productivitySchema);

module.exports = {
  Productivity: productivity
};

