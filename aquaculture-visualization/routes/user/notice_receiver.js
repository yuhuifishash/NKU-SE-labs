var express = require('express');
var router = express.Router();    
var db = require('../../utils/db');

router.post('/', async function (req, res, next) {

    const sql = 'SELECT * FROM notice WHERE Receiver = ? ORDER BY Time DESC'
    console.log(req.body)
    var result = await db.query(sql,[req.body.params.username])
    res.json(result)
});
module.exports = router;