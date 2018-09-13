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
router.post("/items/new", mw.isLoggedIn, function(req, res) {
    if (req.body.name == "") {
        req.flash("failure", "You cannot add an empty item");
        res.redirect("back");
    } else {
        var total = req.body.total;
        if(req.body.total == "") {
            total = 0;
        }
        Item.create({
            name: req.body.name,
            total: total,
            owner: req.user.username
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
    }
});

/** user can join an item **/
router.post("/items/join", mw.isLoggedIn, function(req, res) {
    if (req.body.itemLink == "") {
        req.flash("failure", "Link cannot be empty");
        res.redirect("back");
    }
    var link = req.body.itemLink.split("/");
    if (link.length != 4 || link[0] != "https:" || link[1] != "" || link[2] != "ticker_tracker.com") {
        req.flash("failure", "Invalid link");
        res.redirect("back");
    }
    else {
        var noPush = false;
        Item.findById(link[3], function(err, item) {
            if (err || !item) {
                if(!item) {
                    req.flash("failure", "Item doesn't exsist");
                }
                else {
                    req.flash("failure", "Something went wrong");
                }
                console.log("GET: /items/:id", err);
                res.redirect("back");
            }
            else {
                var user = new User();
                user._id = req.user._id;
                user.username = req.user.username;
                for (var i=0;i<item.users.length;i++) {
                    if(item.users[i]._id == link[3]) {
                        noPush = true;
                        break;
                    }
                }
                if (!noPush) {
                    item.users.push(user);
                }
                item.save();
                User.findById(req.user._id, function(err, user) {
                    if (err || !user) {
                        if(!user) {
                            req.flash("failure", "User not found");
                        }
                        else {
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("PUT: /items/:id", err);
                        res.redirect("back");
                    }
                    else {
                        user.items.push(item);
                        user.save();
                        res.redirect("/items/" + link[3]);
                    }
                });
            }
        });
    }
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
            console.log("GET: /items/:id", err);
            res.redirect("back");
        }
        else {
            res.render("./items/show", {item: item});
        }
    });
});

/** user consumes an item **/
router.put("/items/:id", mw.isLoggedIn, function(req, res) {
    // update total and amount Item collection
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("PUT: /items/:id", err);
            res.redirect("back");
        }
        else {
            var enough = +item.total - +req.body.amount;
            if(+item.total >= 0 && enough >= 0) {
                for (var i=0; i<item.users.length;i++) {
                    if (item.users[i]._id.equals(req.user.id)) {
                        // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                        item.users[i].amount = +item.users[i].amount + +req.body.amount;
                    }
                    item.total = enough;
                }
                item.save();
                // update total for all participants
                for (var i=0; i<item.users.length;i++) {
                    User.findById(item.users[i]._id, function(err, user) {
                        if (err || !user) {
                            if(!user) {
                                req.flash("failure", "User not found");
                            }
                            else {
                                req.flash("failure", "Something went wrong");
                            }
                            console.log("PUT: /items/:id", err);
                            res.redirect("back");
                        }
                        else {
                            for (var i=0; i<user.items.length;i++) {
                                if (user.items[i]._id == req.params.id) {
                                    user.items[i].total = enough;
                                }
                            }
                            user.save();
                        }
                    });
                }
                // update amount for current user
                User.findById(req.user._id, function(err, user) {
                    if (err || !user) {
                        if(!user) {
                            req.flash("failure", "User not found");
                        }
                        else {
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("PUT: /items/:id", err);
                        res.redirect("back");
                    }
                    else {
                        for (var i=0; i<user.items.length;i++) {
                            if (user.items[i]._id == req.params.id) {
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
                req.flash("failure", "You don't have enough " + item.name + " in stock");
                res.redirect("back");
            }
        }
    });
});

/** owner adds an amount **/
router.put("/items/:id/add", mw.isItemOwner, function(req, res) {
    // update total in Item collection
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("PUT: /items/:id/add", err);
            res.redirect("back");
        }
        else {
            var enough = +item.total + +req.body.total;
            if (enough >= 0) {
                item.total = enough;
                item.save();
                // update total for all participants
                for (var i=0; i<item.users.length;i++) {
                        User.findById(req.user.id, function(err, user) {
                        if (err || !user) {
                            if(!user) {
                                req.flash("failure", "User not found");
                            }
                            else {
                                req.flash("failure", "Something went wrong");
                            }
                            console.log("PUT: /items/:id/add", err);
                            res.redirect("back");
                        }
                        else {
                            for (var i=0; i<user.items.length;i++) {
                                if (user.items[i]._id.equals(req.params.id)) {
                                    user.items[i].total = enough;
                                }
                            }
                            user.save();
                        }
                    });
                }
                res.redirect("/items/" + req.params.id);
            }
            else {
                req.flash("failure", "You cannot have negative amount in stock");
                res.redirect("back");
            }
        }
    });
});

/** show edit page **/
router.get("/items/:id/edit", mw.isItemOwner, function(req, res) {
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("GET: /items/:id/add", err);
            res.redirect("back");
        }
        else {
            res.render("./items/edit", {item: item});
        }
    });
});

/** owner edits an item **/
router.put("/items/:id/edit", mw.isItemOwner, function(req, res) {
    // update name and total in Item colleciton
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("PUT: /items/:id/edit", err);
            res.redirect("back");
        }
        else {
            item.total = req.body.total;
            item.name = req.body.name;
            item.save();
            // update total and name for all participants
            for (var i=0; i<item.users.length;i++) {
                User.findById(req.user.id, function(err, user) {
                    if (err || !user) {
                        if(!user) {
                            req.flash("failure", "User not found");
                        }
                        else {
                            req.flash("failure", "Something went wrong");
                        }
                        console.log("PUT: /items/:id/edit", err);
                        res.redirect("back");
                    }
                    else {
                        for (var i=0; i<user.items.length;i++) {
                            if (user.items[i]._id.equals(req.params.id)) {
                                // source: https://stackoverflow.com/questions/8976627/how-to-add-two-strings-as-if-they-were-numbers
                                user.items[i].name = req.body.name;
                                user.items[i].total = req.body.total;
                            }
                        }
                        user.save();
                    }
                });
            }
            res.redirect("/items/" + req.params.id);
        }
    });
});

/** owner deletes an item **/
router.delete("/items/:id", mw.isItemOwner, function(req, res) {
    // find item to find all users
    var error = false;
    Item.findById(req.params.id, function(err, item) {
        if (err || !item) {
            if(!item) {
                req.flash("failure", "Item not found");
            }
            else {
                req.flash("failure", "Something went wrong");
            }
            console.log("PUT: /items/:id", err);
            res.redirect("back");
        }
        else {
            // find users to remove item
            for (var i=0; i<item.users.length;i++) {
                User.findById(item.users[i]._id, function(err, user) {
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
                            }
                        }
                        user.save();
                    }
                });
            }
        }
    });
    // remove item
    Item.findByIdAndRemove(req.params.id, function(err) {
        if (err) {
            req.flash("error", "Something went wrong");
            console.log("DELETE: /items/:id", err);
            res.redirect("back");
        }
        else {
            res.redirect("/items");
        }
    });
});

module.exports = router;