import Http from '../http'

// 获取AI选股列表
export const getAiStockPickers = function(params?: any) {
    return Http.get('/ai-stock-picker', params)
}

// 获取单个AI选股记录
export const getAiStockPickerById = function(id: string) {
    return Http.get(`/ai-stock-picker/${id}`)
}

// 创建AI选股记录
export const createAiStockPicker = function(pickerData: any) {
    return Http.post('/ai-stock-picker', pickerData)
}

// 更新AI选股记录
export const updateAiStockPicker = function(id: string, pickerData: any) {
    return Http.put(`/ai-stock-picker/${id}`, pickerData)
}

// 删除AI选股记录
export const deleteAiStockPicker = function(id: string) {
    return Http.delete(`/ai-stock-picker/${id}`)
}