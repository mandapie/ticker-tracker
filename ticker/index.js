/* packages */
var express = require("express"),
bodyParser = require("body-parser"),
methodOverride = require("method-override"),
mongoose = require("mongoose"),
passport = require("passport"),
localStrat = require("passport-local"),
session = require("express-session"),
flash = require("connect-flash");

/* models */
var User = require("./models/user"),
Item = require("./models/item");

/* app setup */
var app = express();
mongoose.connect("mongodb://localhost:27017/ticker", { useNewUrlParser: true });
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(flash());
app.use(session({
    secret: "Soylent is the best drink?",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

/* passport configuration */
passport.use(new localStrat(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* middleware */
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.failure = req.flash("failure");
    res.locals.success = req.flash("success");
    next();
});

/* use routes */
app.use(require("./routes/index"));
app.use(require("./routes/items"));

app.listen(process.env.PORT, process.env.IP, function() {
    console.log("starting ticker...");
});