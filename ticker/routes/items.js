var express = require("express");
var User = require("../models/user");
var mw = require("../middleware/index");

var router = express.Router();

/** show all items of user **/
router.get("/items", mw.isLoggedIn, function(req, res) {
    res.render("./items/index", {page: "items"});
});

/** add a new item **/
router.get("items/new", function(req, res) {
    
});

module.exports = router;