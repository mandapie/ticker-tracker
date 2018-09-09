var mongoose = require("mongoose");

var itemSchema = new mongoose.Schema({
    name: String,
    total: Number,
    creator: String,
    users: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
        username: String,
        amount: { type: Number, default: 0 }
    }]
});

module.exports = mongoose.model("item", itemSchema);