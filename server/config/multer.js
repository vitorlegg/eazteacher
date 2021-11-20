var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');

module.exports = multer({
    storage: multerS3({
        s3: new aws.S3(),
        contentType:multerS3.AUTO_CONTENT_TYPE,
        bucket: process.env.AWS_BUCKET_NAME,
        acl: 'public-read',
        key: (req, file, cb) =>{
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
        }
    })
});