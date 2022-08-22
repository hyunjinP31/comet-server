const S3 = require('aws-sdk/clients/s3');
const fs = require('fs');
const access = fs.readFileSync('./s3.json');
const acce = JSON.parse(access);

const s3 = new S3 ({
    region: acce.region,
    accessKeyId: acce.accessKeyId,
    secretAccessKey: acce.secretAccessKey
})

// 업로드
function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadPatams = {
        Bucket: 'comet-server-support',
        Body: fileStream,
        key: file.filename
    }

    return s3.upload(uploadPatams).promise()
}

module.exports = uploadFile

// 다운로드