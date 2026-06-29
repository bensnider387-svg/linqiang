import Http from '../http'

//登录验证码
export const verificationImg = function () {
  return Http.get('/login/verificationImg')
}

//登录二维码
export const loginQrcode = function () {
  return Http.get('/login/loginQrcode')
}

// 上传文件
export const uploadFile = function(fileData: any) {
    return Http.post('/upload', fileData)
}

// 上传图片文件
export const uploadImage = function(file: FormData) {
    return Http.post('/upload/images', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}