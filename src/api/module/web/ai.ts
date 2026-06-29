import Http from '../../http'

/**
 * 调用AI股票推荐接口
 * @param criteria 选股标准参数
 * @returns Promise<any> 包含推荐结果的Promise
 */
export const getStockRecommendations = function(criteria: any) {
    return Http.post('/web/ai/stock-picker', criteria)
}

/**
 * 调用AI投资组合诊断接口
 * @param data 诊断所需数据（股票代码、购买价格、购买日期等）
 * @returns Promise<any> 包含诊断结果的Promise
 */
export const getPortfolioDiagnosis = function(data: any) {
    return Http.post('/web/ai/portfolio-diagnosis', data)
}

/**
 * 获取AI推荐历史记录
 * @returns Promise<any> 包含历史记录的Promise
 */
export const getAIHistory = function() {
    return Http.get('/web/ai/apihistory')
}