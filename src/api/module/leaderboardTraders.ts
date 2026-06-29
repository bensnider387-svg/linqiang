import Http from '../http'

// 获取交易员排行榜列表
export const getList = function(params?: any) {
    return Http.get('/leaderboard-traders', params)
}

// 获取单个交易员排行榜详情
export const getDetail = function(id: string) {
    return Http.get(`/leaderboard-traders/${id}`)
}

// 创建交易员排行榜
export const create = function(leaderboardData: any) {
    return Http.post('/leaderboard-traders', leaderboardData)
}

// 更新交易员排行榜
export const update = function(id: string, leaderboardData: any) {
    return Http.put(`/leaderboard-traders/${id}`, leaderboardData)
}

// 删除交易员排行榜
export const del = function(id: string) {
    return Http.delete(`/leaderboard-traders/${id}`)
}