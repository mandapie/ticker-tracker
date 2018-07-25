var mongoose = require("mongoose"),
passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
    username: String,
    password: String,
    items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "item"
    }]
});

userSchema.plugin(passportLocalMongoose());

module.exports = mongoose.model("user", userSchema);