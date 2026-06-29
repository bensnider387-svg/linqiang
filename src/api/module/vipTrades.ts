import Http from '../http'

// 获取VIP交易记录列表
export const getVipTrades = function(params?: any) {
    return Http.get('/vip-trades', params)
}

// 获取单个VIP交易记录
export const getVipTradeById = function(id: string) {
    return Http.get(`/vip-trades/${id}`)
}

// 创建VIP交易记录
export const createVipTrade = function(vipTradeData: any) {
    return Http.post('/vip-trades', vipTradeData)
}

// 更新VIP交易记录
export const updateVipTrade = function(id: string, vipTradeData: any) {
    return Http.put(`/vip-trades/${id}`, vipTradeData)
}

// 删除VIP交易记录
export const deleteVipTrade = function(id: string) {
    return Http.delete(`/vip-trades/${id}/delete`)
}