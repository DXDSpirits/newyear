var settings = require('../settings/settings.js');
var express = require('express');
var router = express.Router();

router.get('/corslogin/:token', function(req, res, next) {
    var token = req.params.token;
    res.render('corslogin', {
        token: token
    });
});

router.get('/', function(req, res) {
    res.render('greeting', {
        title: 'Greeting'
    });
});

router.get('/graph', function(req, res) {
    res.render('graph');
});

module.exports = router;
