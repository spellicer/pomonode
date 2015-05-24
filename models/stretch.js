var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Productivity = require('productivity').Productivity
;

var stretchSchema = new Schema({
  start : { type: Date, required: true, default: Date.now },
  end : { type: Date },
  productivity : { type: Productivity, required: true }
});

var stretch = mongoose.model('stretch', stretchSchema);

module.exports = {
  Stretch: stretch
};

