import Http from '../http';

// 获取用户统计概览数据
export const getUserOverview = function() {
    return Http.get('/user-statistics/overview');
};

// 获取用户增长趋势数据
export const getUserGrowth = function() {
    return Http.get('/user-statistics/growth');
};

// 获取用户资产分布数据
export const getUserAssetDistribution = function() {
    return Http.get('/user-statistics/asset-distribution');
};