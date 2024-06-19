var express = require('express');
var router = express.Router();
var db = require('../../utils/db');

router.post('/', async function(req, res, next) {
    var params = req.body.params
    console.log(params)
    if(params.date == '' || params.type == '' || params.quantity == '' || params.size == ''){
        res.json({
            status:202
        }); 
        return;
    }
    const sql = 'INSERT INTO fish_count_data VALUES(?,?,?,?)'
    await db.query(sql,[params.date,params.type,params.quantity,params.size])
    if(params.quantity > 1000){
        const sql = 'INSERT INTO notice VALUES("鱼群数量过多,请立刻检查当前养殖区域是否能够提供足够的资源。",?,?,now(),\'Warn\')'
        await db.query(sql,[params.username,params.username])
    }

    res.json({
        status:200
    });
})

module.exports = router; 