var express = require('express');
var router = express.Router();
var db = require('../../utils/db');

router.get('/', async function(req, res, next) {
    var filename = req.query.url
    res.download(filename)
})

module.exports = router;