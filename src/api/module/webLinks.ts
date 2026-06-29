import Http from '../http'

// 定义网站链接接口 - 与数据库表结构匹配
export interface WebLink {
  id: string;
  trader_uuid: string;
  webname: string;
  link_url: string;
  createtime: string;
}

// 获取网站链接列表
export const getWebLinks = function(params?: any) {
    return Http.get('/web-links/list', params)
}

// 获取单个网站链接
export const getWebLinkById = function(id: string) {
    return Http.get(`/web-links/${id}`)
}

// 创建网站链接
export const createWebLink = function(webLinkData: any) {
    return Http.post('/web-links/add', webLinkData)
}

// 更新网站链接
export const updateWebLink = function(id: string, webLinkData: any) {
    return Http.put(`/web-links/update/${id}`, webLinkData)
}

// 删除网站链接
export const deleteWebLink = function(id: string) {
    return Http.delete(`/web-links/delete/${id}`)
}