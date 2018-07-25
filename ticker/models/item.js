var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    amount: Number
});

module.exports = mongoose.model("item", itemSchema);