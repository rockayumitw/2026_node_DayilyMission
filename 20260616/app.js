const dotenv = require('dotenv')
dotenv.config()

const getUploadConfig  = () => {
    return {
        uploadDir: process.env.UPLOAD_DIR || '/temp',
        maxFileSize: Number(process.env.MAX_FILE_SIZE_MB) || 5,
        gymName: process.env.GYM_NAME || '未命名健身房',
    }
}

console.log(getUploadConfig())