/* packages */
var express = require("express"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
passport = require("passport"),
localStrat = require("passport-local");

/* models */
var User = require("./models/user"),
Item = require("./models/item");

/* app setup */
var app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
mongoose.connect("mongodb://localhost:27017/ticker", { useNewUrlParser: true });

/* passport configuration */


/** homepage **/
app.get("/", function(req, res) {
    res.render("index");
});

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("starting ticker...");
});