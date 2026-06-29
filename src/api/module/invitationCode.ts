import Http from '../http';

// 邀请码数据接口定义
export interface InvitationCode {
  id: number;
  trader_uuid?: string;
  user_id?: string;
  code: string;
  isuse: boolean;
  create_user_id?: string;
  create_time: string;
  used_time?: string;
  username?: string;
}

// 获取邀请码列表
export const getInvitationCodeList = async (params?:any) => {
  try {
    const response = await Http.get('/invitation-code', 
      params
    );
    return response;
  } catch (error) {
    console.error('获取邀请码列表失败:', error);
    throw error;
  }
};

// 获取单个邀请码详情
export const getInvitationCodeDetail = async (id: number) => {
  try {
    const response = await Http.get(`/invitation-code/${id}`);
    return response;
  } catch (error) {
    console.error('获取邀请码详情失败:', error);
    throw error;
  }
};

// 创建新的邀请码
export const createInvitationCode = async () => {
  try {
    const response = await Http.post('/invitation-code', null);
    return response;
  } catch (error) {
    console.error('创建邀请码失败:', error);
    throw error;
  }
};

// 更新邀请码
export const updateInvitationCode = async (
  id: number,
  data: Partial<{
    code: string;
    isuse: boolean;
    user_id: string;
    username: string;
  }>
) => {
  try {
    const response = await Http.put(`/invitation-code/${id}`, data);
    return response;
  } catch (error) {
    console.error('更新邀请码失败:', error);
    throw error;
  }
};

// 删除邀请码
export const deleteInvitationCode = async (id: number) => {
  try {
    const response = await Http.delete(`/invitation-code/${id}`);
    return response;
  } catch (error) {
    console.error('删除邀请码失败:', error);
    throw error;
  }
};

// 批量创建邀请码
export const batchCreateInvitationCode = async (count: number) => {
  try {
    const response = await Http.post('/invitation-code', { count });
    return response;
  } catch (error) {
    console.error('批量创建邀请码失败:', error);
    throw error;
  }
};

// 批量删除邀请码
export const batchDeleteInvitationCode = async (ids: number[]) => {
  try {
    const promises = ids.map(id => deleteInvitationCode(id));
    const results = await Promise.all(promises);
    return results;
  } catch (error) {
    console.error('批量删除邀请码失败:', error);
    throw error;
  }
};