import Http from '../http'

// 获取会员积分规则列表
export const getMembershipPointsRules = function(params?: any) {
    return Http.get('/membership-points-rules', params)
}

// 获取单个会员积分规则
export const getMembershipPointsRuleById = function(id: string) {
    return Http.get(`/membership-points-rules/${id}`)
}

// 创建会员积分规则
export const createMembershipPointsRule = function(ruleData: any) {
    return Http.post('/membership-points-rules', ruleData)
}

// 更新会员积分规则
export const updateMembershipPointsRule = function(id: string, ruleData: any) {
    return Http.put(`/membership-points-rules/${id}`, ruleData)
}

// 删除会员积分规则
export const deleteMembershipPointsRule = function(id: string) {
    return Http.delete(`/membership-points-rules/${id}`)
}