var express = require('express');
var router = express.Router();
var db = require('../../utils/db');
const tokenhandler = require('../../utils/token');
var fs = require('fs');

const Json2csvParser = require('json2csv').Parser;

router.use('/',tokenhandler.DataAdminVerify);

router.post('/', async function (req, res, next) {
    results = []
    path = "" 
    if(req.body.params.type == 'aquadata'){
        const sql_aqua = 'SELECT * FROM aquadata '
        results  = await db.query(sql_aqua, []);
        const json2csvParser = new Json2csvParser();
        const csv = json2csvParser.parse(results);
        path = "./datas/aquadata"+ Date.now().toString() +".csv"
        fs.writeFile(path, csv, function(err) {
            console.log("save csv");
        });
    }else if(req.body.params.type == 'fishdata'){
        const sql_aqua = 'SELECT * FROM fishdata '
        results  = await db.query(sql_aqua, []);
        const json2csvParser = new Json2csvParser();
        const csv = json2csvParser.parse(results);
        path = "./datas/fishdata"+ Date.now().toString() +".csv"
        fs.writeFile(path, csv, function(err) {
            console.log("save csv");
        });
    }else if(req.body.params.type == 'fishkinddata'){
        const sql_aqua = 'SELECT * FROM fish_count_data '
        results  = await db.query(sql_aqua, []);
        const json2csvParser = new Json2csvParser();
        const csv = json2csvParser.parse(results);
        path = "./datas/fish_count_data"+ Date.now().toString() +".csv"
        fs.writeFile(path, csv, function(err) {
            console.log("save csv");
        });
    }
    res.send({
        url: path
    })
});

var DownLoadRouter = require('./download');
var FishKindUploadRouter = require('./fishkind_upload');
var FishUploadRouter = require('./fish_upload');
var AquaUploadRouter = require('./aqua_upload');

router.use('/download',DownLoadRouter);
router.use('/fishkind_upload',FishKindUploadRouter);
router.use('/fish_upload',FishUploadRouter);
router.use('/aqua_upload',AquaUploadRouter);

module.exports = router;
