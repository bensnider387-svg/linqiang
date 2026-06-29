import Http from '../http'

// 获取交易者档案列表
export const getTraderProfiles = function(params?: any) {
    return Http.get('/trader-profiles', params)
}

// 获取单个交易者档案
export const getTraderProfileById = function(id: string) {
    return Http.get(`/trader-profiles/${id}`)
}

// 创建交易者档案
export const createTraderProfile = function(profileData: any) {
    return Http.post('/trader-profiles', profileData)
}

// 更新交易者档案
export const updateTraderProfile = function(id: string, profileData: any) {
    return Http.put(`/trader-profiles/${id}`, profileData)
}

// 删除交易者档案
export const deleteTraderProfile = function(id: string) {
    return Http.delete(`/trader-profiles/${id}`)
}