var express = require("express");
var User = require("../models/user");
var Item = require("../models/item");
var mw = require("../middleware");

var router = express.Router();

/** show all items of user **/
router.get("/items", mw.isLoggedIn, function(req, res) {
    User.findById(req.user._id).populate("items").exec(function(err, userId) {
        if (err) {
            req.flash("failure", "Something went wrong");
            console.log("GET: /items", err);
            res.redirect("back");
        }
        else {
            res.render("./items/index", {page: "items", user: userId});
        }
    });
});

/** add a new item **/
router.post("/items/new", function(req, res) {
    Item.create({
        name: req.body.name,
        total: req.body.total,
        creator: req.user.username
    }, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("POST: /items/new", err);
            res.redirect("back");
        }
        else {
            item.users.push(req.user);
            item.save();
            User.findById(req.user._id, function(err, user) {
                if (err) {
                    req.flash("error", "Something went wrong");
                    console.log("POST: /items/new: User", err);
                    res.redirect("back");
                }
                else {
                    user.items.push(item);
                    user.save();
                    res.redirect("/items");
                }
            });
        }
    });
});

// router.put("/users", function(req, res) {
//     User.findByIdAndUpdate(req.user._id, req.user, function(err, user) {
//         user._id = req.user._id;
//         user.username = req.user.username;
        
//     });
// });

module.exports = router;