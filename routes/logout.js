var express = require('express');
var router = express.Router();
var session = require('express-session');

router.get('/', function (req, res, next) {

    if (req.session.user && req.cookies.user_sid) {
        res.clearCookie('user_sid');
        res.redirect('/');
    } else {
        res.redirect('/login');
    }

});

module.exports = router;
