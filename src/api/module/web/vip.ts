import Http from '../../http'

// 获取当前VIP信息
export const get_userinfo = function() {
    return Http.get('/web/vip/userinfo')
}
// 获取当前VIP信息
export const get_membership_levels = function() {
    return Http.get('/web/vip/membership_levels')
}
// 获取VipDashboard页面数据
export const get_VipDashboardData = function() {
    return Http.get('/web/vip/VipDashboardData')
}
// 获取交易市场列表
export const get_market_list = function() {
    return Http.get('/web/vip/marketlist')
}

// 创建VIP交易记录（上传交易记录）
export const createVipTrade = function(tradeData: any) {
    return Http.post('/web/vip/upload-trade', tradeData)
}

// 创建VIP交易记录（上传交易记录）
export const closetrades = function(tradeData: any) {
    return Http.post('/web/vip/close-trades', tradeData)
}

// 修改用户密码接口
export const changePassword = function(passwordData: any) {
    return Http.post('/web/vip/change-password', passwordData)
}

// 更新用户头像接口
export const updateUserAvatar = function(avatarData: any) {
    return Http.post('/web/vip/update-avatar', avatarData)
}
// 更新用户等级接口
export const updateUserLevel = function(levelData: any) {
    return Http.post('/web/vip/changeuserlevel', levelData)
}

// 获取随机题目接口
export const get_random_questions = function() {
    return Http.get('/web/vip/random-questions')
}
// 开始答题接口
export const startquestions = function(questionData: any) {
    return Http.post('/web/vip/startquestions', questionData)
}

// 获取股票实时价格接口
export const get_stock_prices = function(symbols: string[]) {
    return Http.post('/web/vip/stock-prices', { symbols })
}

// 创建支付记录接口
export const createPaymentRecord = function(paymentData: any) {
    return Http.post('/web/vip/create-payment-record', paymentData)
}