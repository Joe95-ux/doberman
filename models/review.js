const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type:String
    },
    avatar:{
        type:String
    },
    text:{
        type: String
    }
});

module.exports = mongoose.model("Review", ReviewSchema);