import Http from '../http'

// 定义VIP公告接口
export interface VipAnnouncement {
  id: number;
  title: string;
  content: string;
  publisher?: string;
  date: string;
  priority?: string;
  type?: string;
  created_at?: string;
  updated_at?: string;
  trader_uuid?: string;
}

// 获取VIP公告列表
export const getVipAnnouncements = (params?: {
  limit?: number;
  offset?: number;
  search?: string;
  priority?: string;
  type?: string;
}) => {
  return Http.get('/vip-announcements', params);
};

// 获取单个VIP公告
export const getVipAnnouncement = (id: number) => {
  return Http.get(`/vip-announcements/${id}`);
};

// 创建VIP公告
export const createVipAnnouncement = (data: {
  title: string;
  content: string;
  publisher?: string;
  date: string;
  priority?: string;
  type?: string;
  trader_uuid?: string;
}) => {
  return Http.post('/vip-announcements', data);
};

// 更新VIP公告
export const updateVipAnnouncement = (id: number, data: {
  title?: string;
  content?: string;
  publisher?: string;
  date?: string;
  priority?: string;
  type?: string;
}) => {
  return Http.put(`/vip-announcements/${id}`, data);
};

// 删除VIP公告
export const deleteVipAnnouncement = (id: number) => {
  return Http.delete(`/vip-announcements/${id}`);
};