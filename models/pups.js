const mongoose = require("mongoose");

const pupsSchema = new mongoose.Schema({
    photo: String,
    name: String,
    sex: String,
    age: String,
    vaccination: String,
    price: String,
    description:String,
    rating:Number,
    category: {
      type: String,
      default: 'Dobberman'
    }
  });

  module.exports = mongoose.model("Pup", pupsSchema);