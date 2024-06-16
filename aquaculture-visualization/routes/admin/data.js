var express = require('express');
var router = express.Router();
var db = require('../../utils/db');
const tokenhandler = require('../../utils/token');
var fs = require('fs');

const Json2csvParser = require('json2csv').Parser;

const aquafields = ["province","drain_basin","river_section","time","quality_type","temperature","pH","oxygen","conductivity","turbidity_ntu","permanganate_index","ammonia_nitrogen","total_phosphate","total_nitrogen","chl_a","algae_density","site_state"]

router.use('/',tokenhandler.DataAdminVerify);

router.post('/', async function (req, res, next) {
    results = []
    path = ""
    if(req.body.params.type == 'aquadata'){
        const sql_aqua = 'SELECT * FROM aquadata '
        results  = await db.query(sql_aqua, []);
        const json2csvParser = new Json2csvParser({ aquafields });
        const csv = json2csvParser.parse(results);
        path = "./datas/aquadata"+ Date.now().toString() +".csv"
        fs.writeFile(path, csv, function(err) {
            console.log("save csv");
        });
    }
    res.send({
        url: path
    })
});

var DownLoadRouter = require('./download');


router.use('/download',DownLoadRouter);

module.exports = router;
