var mongoose = require('mongoose');
var PlaceSchema = require('./place').schema;

var DaySchema = new mongoose.Schema({
  number: Number,
  hotel: {type: mongoose.Schema.Types.ObjectId, ref: 'Hotel'},
  restaurants: {type: mongoose.Schema.Types.ObjectId, ref: 'Restaurants'},
  activities: {type: mongoose.Schema.Types.ObjectId, ref: 'Activities'}
})

module.exports = mongoose.model('Day', DaySchema);