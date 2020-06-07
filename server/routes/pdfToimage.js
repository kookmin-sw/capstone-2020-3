var express = require('express');
var router = express.Router();
const fs = require('fs');
const AWS = require('aws-sdk');
var exec = require("child_process").exec;
const BUCKET_NAME="portfoliosrc";
let { PythonShell } = require("python-shell");
const s3 = new AWS.S3({
        accessKeyId:'AKIAIQWX5DQKB27UFMRA',
        secretAccessKey: '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'
});


//pdf to png
router.get('/:pName', function(req, res, next) {


	console.log(req.params.pName)

        exec("python ./routes/pdf_to_jpg.py "+req.params.pName, function(err,stdout,stderr){

                console.log(stdout);
                res.send(stdout);
                console.log(err);

        });

});


router.get('/final/:pName',function(req,res,next){


	exec("python /home/ubuntu/pdftotagcloud_tmp.py "+req.params.pName,function(err,stdout,stderr){
		console.log(stdout);
		console.log(err);
});



});


module.exports = router;

