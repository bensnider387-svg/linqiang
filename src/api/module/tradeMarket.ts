import Http from '../http'

// 获取交易市场列表
export const getTradeMarkets = function(params?: any) {
    return Http.get('/trade-market', params)
}

// 获取单个交易市场
export const getTradeMarketById = function(id: number) {
    return Http.get(`/trade-market/${id}`)
}

// 创建交易市场
export const createTradeMarket = function(marketData: any) {
    return Http.post('/trade-market', marketData)
}

// 更新交易市场
export const updateTradeMarket = function(id: number, marketData: any) {
    return Http.put(`/trade-market/${id}`, marketData)
}

// 删除交易市场
export const deleteTradeMarket = function(id: number) {
    return Http.delete(`/trade-market/${id}`)
}