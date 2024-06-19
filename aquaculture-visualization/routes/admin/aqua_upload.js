var express = require('express');
var router = express.Router();
var db = require('../../utils/db');

router.post('/', async function(req, res, next) {
    var params = req.body.params
    const sql = 'INSERT INTO aquadata VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
    await db.query(sql,[params.province,params.drain,params.section,params.time,params.type,params.temp,
        params.pH,params.oxygen,params.cond,params.tur,params.kmno,params.nh3,params.k,params.n,params.chl,
        params.algae,params.situation])
    res.json({ 
        status:200
    });
})

module.exports = router; 