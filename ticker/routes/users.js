var express = require("express");
var User = require("../models/user");
var Item = require("../models/item");
var mw = require("../middleware");

var router = express.Router();

router.get("/users", mw.isLoggedIn, function(req, res) {
    res.render("./users/index");
});

module.exports = router;