import Http from '../http'

// 获取会员等级列表
export const getMembershipLevels = function(params?: any) {
    return Http.get('/membership-levels', params)
}

// 获取单个会员等级
export const getMembershipLevelById = function(id: string) {
    return Http.get(`/membership-levels/${id}`)
}

// 创建会员等级
export const createMembershipLevel = function(levelData: any) {
    return Http.post('/membership-levels', levelData)
}

// 更新会员等级
export const updateMembershipLevel = function(id: string, levelData: any) {
    return Http.put(`/membership-levels/${id}`, levelData)
}

// 删除会员等级
export const deleteMembershipLevel = function(id: string) {
    return Http.delete(`/membership-levels/${id}`)
}