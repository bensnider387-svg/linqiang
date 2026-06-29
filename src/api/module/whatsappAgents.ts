import Http from '../http'

// 获取WhatsApp代理列表
export const getWhatsappAgents = function(params?: any) {
    return Http.get('/whatsapp-agents', params)
}

// 获取单个WhatsApp代理
export const getWhatsappAgentById = function(id: number) {
    return Http.get(`/whatsapp-agents/${id}`)
}

// 创建WhatsApp代理
export const createWhatsappAgent = function(agentData: any) {
    return Http.post('/whatsapp-agents', agentData)
}

// 更新WhatsApp代理
export const updateWhatsappAgent = function(id: number, agentData: any) {
    return Http.put(`/whatsapp-agents/${id}`, agentData)
}

// 删除WhatsApp代理
export const deleteWhatsappAgent = function(id: number) {
    return Http.delete(`/whatsapp-agents/${id}`)
}