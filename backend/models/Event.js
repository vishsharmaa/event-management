const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
  title: String,
  description: String,
  date: Date,
  price: Number,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});
module.exports = mongoose.model('Event', eventSchema); 