// upload.js
const multer = require('multer');
const multerS3 = require('multer-s3')
const AWS = require("aws-sdk");
const fs = require('fs');
const access = fs.readFileSync('./s3.json');
const acce = JSON.parse(access);

const s3 = new AWS.S3({
    accessKeyId: acce.accessKeyId, // 액세스 키 입력
    secretAccessKey: acce.secretAccessKey, // 비밀 액세스 키 입력
    region: acce.region, // 사용자 사용 지역 (서울의 경우 ap-northeast-2)
});

const upload = multer({ 
    storage: multerS3({ 
        s3: s3, 
        bucket: 'comet-server-support', // 버킷 이름 입력 
        contentType: multerS3.AUTO_CONTENT_TYPE,
        acl: 'public-read',
        key: (req, file, cb) => { 
            cb(null, `uploads/${Date.now()}_${file.originalname}`)
        }
    })
});

module.exports = upload;