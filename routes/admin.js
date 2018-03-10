// Module
var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next) {
    if (req.session.user && req.cookies.user_sid) {
        res.render('admin', {});
    } else {
        res.redirect('/login');
    }
});

module.exports = router;
