import Http from '../http'

// 获取交易员交易记录列表
export const getTrades1 = function(params?: any) {
    return Http.get('/trades1', params)
}

// 获取单个交易员交易记录
export const getTrade1ById = function(id: string) {
    return Http.get(`/trades1/${id}`)
}

// 创建交易员交易记录
export const createTrade1 = function(tradeData: any) {
    return Http.post('/trades1', tradeData)
}

// 更新交易员交易记录
export const updateTrade1 = function(id: string, tradeData: any) {
    return Http.put(`/trades1/${id}`, tradeData)
}

// 删除交易员交易记录
export const deleteTrade1 = function(id: string) {
    return Http.delete(`/trades1/${id}`)
}