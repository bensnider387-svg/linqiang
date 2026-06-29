import Http from '../http'

// 获取交易策略列表
export const getTradingStrategies = function(params?: any) {
    return Http.get('/trading-strategies', params)
}

// 获取单个交易策略
export const getTradingStrategyById = function(id: number) {
    return Http.get(`/trading-strategies/${id}`)
}

// 创建交易策略
export const createTradingStrategy = function(strategyData: any) {
    return Http.post('/trading-strategies', strategyData)
}

// 更新交易策略
export const updateTradingStrategy = function(id: number, strategyData: any) {
    return Http.put(`/trading-strategies/${id}`, strategyData)
}

// 删除交易策略
export const deleteTradingStrategy = function(id: number) {
    return Http.delete(`/trading-strategies/${id}`)
}