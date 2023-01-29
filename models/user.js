const mongoose = require("mongoose");
const userSchema = require("./userSchema");

module.exports = mongoose.model("User", userSchema);

