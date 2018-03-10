var express = require('express');
var router = express.Router();

// Require controller modules.
var article_controller = require('../controllers/articleController');

// Default Route
router.get('/', function (req, res) {
    res.redirect('article');
});

// Routes for adding Article
router.get('/article', article_controller.index);

router.post('/article', article_controller.add);



module.exports = router;