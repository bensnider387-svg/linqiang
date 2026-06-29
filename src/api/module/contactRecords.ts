import Http from '../http'

// 定义联系记录接口 - 与数据库表结构匹配
export interface ContactRecord {
  id: string;
  device_fingerprint: string;
  agent_id: string;
  ip_address?: string;
  user_agent?: string;
  click_time?: string;
  "timestamp": string;
  trader_uuid?: string;
  // 为了兼容前端现有功能，添加以下扩展字段
  status?: string;
  handled_by?: string | null;
}

// 获取联系记录列表 - 与后端接口匹配
export const getContactRecords = (params?: {
  search?: string;
  offset?: number;
  limit?: number;
}) => {
  return Http.get('/contact-records', params);
};

// 获取单个联系记录
export const getContactRecordById = (id: string) => {
  return Http.get(`/contact-records/${id}`);
};

// 创建联系记录 - 与数据库字段匹配
export const createContactRecord = (recordData: {
  device_fingerprint: string;
  agent_id: string;
  ip_address?: string;
  user_agent?: string;
  click_time?: string;
  trader_uuid?: string;
  // 为了兼容前端现有功能，添加以下扩展字段
  status?: string;
  handled_by?: string | null;
}) => {
  return Http.post('/contact-records', recordData);
};

// 更新联系记录 - 与数据库字段匹配
export const updateContactRecord = (id: string, recordData: {
  device_fingerprint?: string;
  agent_id?: string;
  ip_address?: string;
  user_agent?: string;
  click_time?: string;
  trader_uuid?: string;
  // 为了兼容前端现有功能，添加以下扩展字段
  status?: string;
  handled_by?: string | null;
}) => {
  return Http.put(`/contact-records/${id}`, recordData);
};

// 删除联系记录
export const deleteContactRecord = (id: string) => {
  return Http.delete(`/contact-records/${id}`);
};