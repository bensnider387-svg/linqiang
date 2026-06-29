import Http from '../http'

// 获取支付记录列表
export const getPaymentRecords = function(params?: any) {
    return Http.get('/payment-records', params)
}

// 获取单个支付记录
export const getPaymentRecordById = function(id: number) {
    return Http.get(`/payment-records/${id}`)
}

// 创建支付记录
export const createPaymentRecord = function(paymentData: any) {
    return Http.post('/payment-records', paymentData)
}

// 更新支付记录
export const updatePaymentRecord = function(id: number, paymentData: any) {
    return Http.put(`/payment-records/${id}`, paymentData)
}

// 删除支付记录
export const deletePaymentRecord = function(id: number) {
    return Http.delete(`/payment-records/${id}`)
}

// 审核支付记录
export const reviewPaymentRecord = function(id: number, reviewData: any) {
    return Http.put(`/payment-records/${id}/review`, reviewData)
}

// 上传图片文件
export const uploadImage = function(file: FormData) {
    return Http.post('/upload/images', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}