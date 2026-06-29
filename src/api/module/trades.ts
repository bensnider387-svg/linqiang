import Http from '../http'

// 获取交易记录列表
export const getTrades = function(params?: any) {
    return Http.get('/trades', params)
}

// 获取单个交易记录
export const getTradeById = function(id: string) {
    return Http.get(`/trades/${id}`)
}

// 创建交易记录
export const createTrade = function(tradeData: any) {
    return Http.post('/trades', tradeData)
}

// 更新交易记录
export const updateTrade = function(id: string, tradeData: any) {
    return Http.put(`/trades/${id}`, tradeData)
}

// 删除交易记录
export const deleteTrade = function(id: string) {
    return Http.delete(`/trades/${id}`)
}