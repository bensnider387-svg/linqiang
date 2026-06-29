import Http from '../http'

// 登录接口
export const login = function(loginForm: any) {
    return Http.post('/users/login', loginForm)
}

// 管理员登录接口
export const adminLogin = function(loginForm: any) {
    return Http.post('/users/adminlogin', loginForm)
}

// 登出接口
export const logout = function(sessionToken?: string) {
    return Http.post('/users/logout', { session_token: sessionToken })
}

// 获取当前登录用户信息
export const getCurrentUser = function() {
    return Http.post('/users/me')
}

// 获取用户列表
export const getUsers = function(params?: any) {
    return Http.get('/users', params)
}

// 获取单个用户信息
export const getUserById = function(id: string) {
    return Http.get(`/users/${id}`)
}

// 创建用户
export const createUser = function(userData: any) {
    return Http.post('/users', userData)
}

// 更新用户
export const updateUser = function(id: string, userData: any) {
    return Http.put(`/users/${id}`, userData)
}

// 删除用户
export const deleteUser = function(id: string) {
    return Http.delete(`/users/${id}`)
}

// 获取菜单列表
export const menu = function() {
    return Http.get('/menu') 
}

// 获取权限列表
export const permission = function() {
    return Http.get('/permission') 
}