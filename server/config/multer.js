var aws = require('aws-sdk');
var multer = require('multer');
var multerS3 = require('multer-s3');



var SaveType = { 
    local:{
        dest: './' ,
        storage: multer.diskStorage({
            destination: function (req, file, cb) {
            cb(null, './temp')
            },
            filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix)
            }
        })
    },
    s3: {
        storage: multerS3({
            s3: new aws.S3({ /* ... */ }),
            contentType:multerS3.AUTO_CONTENT_TYPE,
            bucket: 'eazteacher',
            acl: 'public-read',
            key: (req, file, cb) =>{
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
                cb(null, file.fieldname + '-' + uniqueSuffix)
            }
        })
    }
}

module.exports = multer(SaveType['s3']);