import Http from '../http'

// 获取用户视图列表
export const getUsersView = function(params?: any) {
    return Http.get('/usersview', params)
}