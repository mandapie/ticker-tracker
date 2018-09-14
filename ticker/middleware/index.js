var Item = require("../models/item");
var User = require("../models/user");
var mw = {};

/** check if user is logged in **/
mw.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash("failure", "Please log in first");
    res.redirect("/login");
};

/** check if user is the owner of the item **/
mw.isItemOwner = function (req, res, next) {
    if(req.isAuthenticated()) {
        Item.findById(req.params.id, function(err, itemId) {
            if (err || !itemId) {
                if(!itemId) {
                    req.flash("failure", "Item not found");
                }
                else {
                    req.flash("failure", "Something went wrong");
                }
                console.log(err);
                res.redirect("back");
            }
            else {
                if(itemId.owner === req.user.username) {
                    next();
                }
                else {
                    req.flash("failure", "You don't have permission");
                    res.redirect("back");
                }
            }
        });
    }
    else {
        req.flash("failure", "Please log in first");
        res.redirect("back");
    }
};

/** check if user is a participant **/
mw.isParticipant = function (req, res, next) {
    if(req.isAuthenticated()) {
        Item.findById(req.params.id, function(err, itemId) {
            if (err || !itemId) {
                if(!itemId) {
                    req.flash("failure", "Item not found");
                }
                else {
                    req.flash("failure", "Something went wrong");
                }
                console.log(err);
                res.redirect("back");
            }
            else {
                for (var i=0; i<itemId.users.length;i++) {
                    if (itemId.users[i]._id == req.user.id) {
                        next();
                    }
                    else {
                        req.flash("failure", "You don't have permission");
                        res.redirect("back");
                        break;
                    }
                }
            }
        });
    }
    else {
        req.flash("failure", "Please log in first");
        res.redirect("back");
    }
};

module.exports = mw;