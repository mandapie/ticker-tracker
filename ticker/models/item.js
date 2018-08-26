var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    amount: Number,
    total: Number,
    user: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }]
});

module.exports = mongoose.model("item", itemSchema);