var express = require('express');
var router = express.Router();

// Require controller modules.
var debugController = require('../controllers/debugController');

// Default Route
router.get('/', debugController.index);


module.exports = router;