// MongoDB Model
var Article = require('../models/article');
var User = require('../models/user');
var Source = require('../models/sources');


exports.index = function (req, res) {

	// GET ARTICLE
	Article.find({})
        .populate('user')
        .populate('source')
        .exec(function (err, articles) {
        	if (err) console.error(err);
        	console.log(articles);
        	res.render('debug', { articles: articles });
        });

}
