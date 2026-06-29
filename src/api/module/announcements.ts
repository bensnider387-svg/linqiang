import Http from '../http'

// 获取公告列表
export const getAnnouncements = function(params?: any) {
    return Http.get('/announcements', params)
}

// 获取单个公告
export const getAnnouncementById = function(id: string) {
    return Http.get(`/announcements/${id}`)
}

// 创建公告
export const createAnnouncement = function(announcementData: any) {
    return Http.post('/announcements', announcementData)
}

// 更新公告
export const updateAnnouncement = function(id: string, announcementData: any) {
    return Http.put(`/announcements/${id}`, announcementData)
}

// 删除公告
export const deleteAnnouncement = function(id: string) {
    return Http.delete(`/announcements/${id}`)
}