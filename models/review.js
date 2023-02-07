const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String
    },
    photo:{
        type:String
    },
    message:{
        type: String
    }
});

module.exports = mongoose.model("Review", ReviewSchema);