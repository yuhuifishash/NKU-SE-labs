var express = require('express');
var router = express.Router();    
var db = require('../../utils/db');

router.post('/', async function (req, res, next) {
    console.log('aquadata_get');
    const { province } = req.body;
    if (!province) {
        return res.status(400).json({ message: 'Province is required' });
    }
    console.log('before sql');
    const sqlQuery = 'SELECT * FROM aquadata WHERE province LIKE ?';
    console.log('before query');
    console.log(sqlQuery);
    result = await db.query(sqlQuery, ['%'.concat(province).concat('%')])
    res.json(result);
    
    // db.query(sqlQuery, [province], (err, results) => {
    //     if (err) {
    //         console('error????')
    //         return res.status(500).json({ message: 'Database query error', error: err });
    //     }
    //     console.log('after search');
    //     console.log('查询结果:', results); // 打印查询结果
    //     res.json(results);
    // });
    console.log('should never be here');
});
module.exports = router;
