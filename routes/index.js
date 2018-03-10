var express = require('express');
var router = express.Router();

// MongoDB Model
var Article = require('../models/article');
var User = require('../models/user');
var Source = require('../models/sources');


/* GET home page. */
router.get('/', function (req, res, next) {

    Article.find({
            approving_state: 1
        }, {
            '_id': 0, 'image': 1, 'title': 1, 'description': 1, 'ratio': 1
        })
        .populate('source', { '_id': 0, 'name': 1 })
        .limit(10)
        .where()
        .sort({ _id: -1 })
        .exec(function (err, articles) {
            if (err) console.error(err);
            res.render('index', { title: 'Express', pages: articles, loginstatus: req.session.user });
        });

});

module.exports = router;
