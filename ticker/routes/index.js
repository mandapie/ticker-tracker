var express = require("express");
var passport = require("passport");
var User = require("../models/user");

var router = express.Router();

/** homepage: show all items by user **/
router.get("/", function(req, res) {
    res.render("index");
});

/** register form **/
router.get("/register", function(req, res) {
    res.render("register");
});

/** register route **/
router.post("/register", function(req, res) {
    User.register(new User({username: req.body.username}), req.body.password, function(err) {
        if (err) {
            return res.render("register", {"failure": err.message});
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/items");
        });
    });
});

/** login form **/
router.get("/login", function(req, res) {
    res.render("login");
});

/** login route **/
router.post("/login", passport.authenticate("local", {
    successRedirect: "/items",
    failureRedirect: "/login"
}));

/** logout route **/
router.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/items");
});

module.exports = router;