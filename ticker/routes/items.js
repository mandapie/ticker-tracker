var express = require("express");
var User = require("../models/user");
var Item = require("../models/item");
var mw = require("../middleware");

var router = express.Router();

/** show all items of current user **/
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

/** show full detail of an item **/
router.get("/items/:id", mw.isLoggedIn, function(req, res) {
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("POST: /items/:id", err);
            res.redirect("back");
        }
        else {
            res.render("./items/show", {item: item});
        }
    });
});

router.put("/items/:id", function(req, res) {
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("POST: /items/:id", err);
            res.redirect("back");
        }
        else {
            var enough = +item.total - +req.body.amount;
            if(+item.total > 0 && enough >= 0) {
                for (var i=0; i<item.users.length;i++) {
                    if (item.users[i]._id.equals(req.user.id)) {
                        // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                        item.total = +item.total - +req.body.amount;
                        item.users[i].amount = +item.users[i].amount + +req.body.amount;
                    }
                }
                item.save();
                User.findById(req.user, function(err, user) {
                    if (err || !user) {
                        if(!user) {
                            req.flash("failure", "User not found");
                        }
                        else {
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("POST: /items/:id", err);
                        res.redirect("back");
                    }
                    else {
                        for (var i=0; i<user.items.length;i++) {
                            if (user.items[i]._id.equals(req.params.id)) {
                                // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                                user.items[i].amount = +user.items[i].amount + +req.body.amount;
                            }
                        }
                        user.save();
                        res.redirect("/items/" + req.params.id);
                    }
                });
            }
            else {
                req.flash("failure", "You don't have anymore " + item.name + " in stock!");
                res.redirect("back");
            }
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