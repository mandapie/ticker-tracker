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
<<<<<<< HEAD
router.post("/items/new", mw.isLoggedIn, function(req, res) {
<<<<<<< HEAD
    if (req.body.name == "") {
        req.flash("failure", "You cannot add an empty item");
        res.redirect("back");
    } else {
        var total = req.body.total;
        if(req.body.total == "") {
            total = 0;
=======
router.post("/items/new", function(req, res) {
=======
>>>>>>> parent of 83e2e0d... added edit page. cancel button works now
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
<<<<<<< HEAD
>>>>>>> parent of a7ef24b... delete works but can't close modal
=======
>>>>>>> parent of 83e2e0d... added edit page. cancel button works now
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
<<<<<<< HEAD
<<<<<<< HEAD
                            for (var i=0; i<user.items.length;i++) {
                                if (user.items[i]._id.equals(req.params.id)) {
                                    // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                                    user.items[i].amount = +user.items[i].amount + +req.body.amount;
                                    user.items[i].total = enough;
                                }
=======
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("POST: /items/:id", err);
=======
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("PUT: /items/:id", err);
>>>>>>> parent of 83e2e0d... added edit page. cancel button works now
                        res.redirect("back");
                    }
                    else {
                        for (var i=0; i<user.items.length;i++) {
                            if (user.items[i]._id.equals(req.params.id)) {
                                // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                                user.items[i].amount = +user.items[i].amount + +req.body.amount;
<<<<<<< HEAD
                                user.items[i].total = +user.items[i].total - +req.body.amount;
>>>>>>> parent of a7ef24b... delete works but can't close modal
=======
                                user.items[i].total = enough;
>>>>>>> parent of 83e2e0d... added edit page. cancel button works now
                            }
                        }
                        user.save();
                        res.redirect("/items/" + req.params.id);
                    }
                });
            }
            else {
                req.flash("failure", "You don't have enough " + item.name + " in stock!");
                res.redirect("back");
            }
        }
    });
});

router.put("/items/:id/add", function(req, res) {
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
            item.total = +item.total + +req.body.total;
            item.save();
            User.findById(req.user.id, function(err, user) {
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
                            user.items[i].total = +user.items[i].total + +req.body.total;
                        }
                    }
<<<<<<< HEAD
                });
            }
            else {
                req.flash("failure", "You cannot have negative amount in stock!");
                res.redirect("back");
            }
        }
    });
});

/** delete an item **/
router.delete("/items/:id", mw.isItemOwner, function(req, res) {
    User.findById(req.user.id, function(err, user) {
        if (err || !user) {
            if(!user) {
                req.flash("failure", "User not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("DELETE: /items/:id", err);
            res.redirect("back");
        }
        else {
            for (var i=0; i<user.items.length;i++) {
                if (user.items[i]._id.equals(req.params.id)) {
                    user.items.splice(i, 1);
=======
                    user.save();
                    res.redirect("/items/" + req.params.id);
>>>>>>> parent of a7ef24b... delete works but can't close modal
                }
            });
        }
    });
});

module.exports = router;