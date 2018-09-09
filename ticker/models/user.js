var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    password: String,
    items: [{
        id: {type: mongoose.Schema.Types.ObjectId, ref: "item"},
        name: String,
        creator: String,
        amount: { type: Number, default: 0 },
        total: Number
    }]
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("user", userSchema);