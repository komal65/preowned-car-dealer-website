const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  carName: { type: String, unique: true },
  carModelName: String,
  price: Number,
  year: Number,
  fuelType: String,
  type: String,
  carImages: [String],
  run: Number
});

const Car = mongoose.model('Car', carSchema);

module.exports = Car;

