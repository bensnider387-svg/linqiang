import Http from '../http'

// 合作单位接口定义
export interface PartnerOrganization {
  id: number;
  name: string;
  logo_url?: string;
  website_url?: string;
  display_order: number;
  is_active: boolean;
  section_title?: string;
  trader_uuid?: string;
  is_vip?: boolean;
  created_at?: string;
  updated_at?: string;
}

// 获取合作单位列表（公开接口）
export const getPartnerOrganizations = function() {
    return Http.get('/partner-organizations')
}

// 获取合作单位列表（管理接口）
export const getPartnerOrganizationsAdmin = function(params?: any) {
    return Http.get('/partner-organizations/admin', params)
}

// 获取单个合作单位
export const getPartnerOrganizationById = function(id: number) {
    return Http.get(`/partner-organizations/${id}`)
}

// 创建合作单位
export const createPartnerOrganization = function(organizationData: any) {
    return Http.post('/partner-organizations', organizationData)
}

// 更新合作单位
export const updatePartnerOrganization = function(id: number, organizationData: any) {
    return Http.put(`/partner-organizations/${id}`, organizationData)
}

// 删除合作单位
export const deletePartnerOrganization = function(id: number) {
    return Http.delete(`/partner-organizations/${id}`)
}

// 更新标题
export const updateSectionTitle = function(sectionTitle: string) {
    return Http.put('/partner-organizations/section-title', { section_title: sectionTitle })
}

// 获取VIP合作单位列表（用于VIP页面）
export const getVipPartnerOrganizations = function() {
    return Http.get('/partner-organizations/vip')
}

