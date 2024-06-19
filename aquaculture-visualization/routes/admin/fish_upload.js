var express = require('express');
var router = express.Router();
var db = require('../../utils/db');

router.post('/', async function(req, res, next) {
    var params = req.body.params
    if(params.date == '' || params.type == '' || params.number == '' || params.lenmin == '' || params.lenmax == '' || params.weight == ''){
        res.json({
            status:202
        }); 
        return;
    }
    const sql = 'INSERT INTO fishdata VALUES(?,?,?,?,?,?)'
    await db.query(sql,[params.date,params.type,params.number,params.lenmin,params.lenmax,params.weight])

    res.json({ 
        status:200
    });
})

module.exports = router; 