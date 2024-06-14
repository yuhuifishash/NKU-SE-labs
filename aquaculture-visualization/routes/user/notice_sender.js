var express = require('express');
var router = express.Router();    
var db = require('../../utils/db');

router.post('/', async function (req, res, next) {
    const sql_select = 'SELECT * FROM user WHERE user_name = ?'
    const sql = 'INSERT INTO notice VALUES(?,?,?,now(),\'Notice\')'
    var result = await db.query(sql_select,[req.body.params.receiver])
    if(result.length > 0){
        await db.query(sql,[req.body.params.text, req.body.params.sender, req.body.params.receiver])
        res.send({
            status: 200,
        })
    }else{
        res.send({
            status: 202,
        })
    }
    
});
module.exports = router;