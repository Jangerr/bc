var express = require('express');
var router = express.Router();
var session = require('express-session');
var bcrypt = require('bcrypt');

// Mongo Models
var User = require('../models/user');

router.get('/', function (req, res, next) {
    res.render("login", {});
});

router.post('/', function (req, res, next) {

    User.findOne({ 'email': req.body.email }, {}).then(function (user) {
        console.log(user);
        if (!user) {
            res.redirect('/login');
        } else {
            // attempt to authenticate user
            User.getAuthenticated(req.body.email, req.body.password, function (err, user, reason) {
                if (err) throw err;

                // login was successful if we have a user
                if (user) {
                    // handle login success
                    req.session.user = req.body.email;
                    res.redirect('/');
                    console.log('login success');
                    return;
                }

                // otherwise we can determine why we failed
                var reasons = User.failedLogin;
                switch (reason) {
                    case reasons.NOT_FOUND:
                    case reasons.PASSWORD_INCORRECT:
                        // note: these cases are usually treated the same - don't tell
                        // the user *why* the login failed, only that it did
                        break;
                    case reasons.MAX_ATTEMPTS:
                        // send email or otherwise notify user that account is
                        // temporarily locked
                        break;
                }
            });

        }

    });




    //// you might like to do a database look-up or something more scalable here
    //if (req.body.email && req.body.email === 'gerrit.hillebrecht@googlemail.com' && req.body.password && req.body.password === 'asd') {
    //    req.session.user = req.body.email;
    //    res.redirect('/admin');
    //} else {
    //    res.redirect('/login');
    //}
});

module.exports = router;
