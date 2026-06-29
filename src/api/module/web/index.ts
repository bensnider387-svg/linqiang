import Http from '../../http'

// 获取交易员信息数据
export const gettrader_profiles = function() {
    return Http.get('/web/trader_profiles')
}

// 获取客服数据
export const get_whatsapp_link = function() {
    return Http.get('/web/get-whatsapp-link')
}


// 获取首页主要数据
export const getIndexData = function() {
    return Http.get('/web/index')
}

// 批量获取持仓实时价格（symbol + trade_market）
export const getStockPrices = function(
  quotes: Array<{ symbol: string; trade_market?: string }>
) {
    return Http.post('/web/stock-prices', { quotes })
}
// 获取首页公告数据
export const getannouncement = function() {
    return Http.get('/web/announcement')
}

// 获取排行榜数据
export const getleaderboard = function(data:any) {
    return Http.get('/web/leaderboard',data)
}

// 交易员点赞接口
export const likeTrader = function(data:any) {
    return Http.post('/web/like-trader', data)
}
// leaderboard点赞接口
export const likeleaderboard= function(data:any) {
    return Http.post('/web/like-leaderboard', data)
}

// leaderboard点赞接口
export const getvideos= function(data:any) {
    return Http.get('/web/videos/videolist', data)
}
// 获取文档数据
export const getdocuments= function(data:any) {
    return Http.get('/web/documents/documentlist', data)
}
