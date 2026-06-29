import Http from '../http'

// 获取视频列表
export const getVideos = function(params?: any) {
    return Http.get('/videos', params)
}

// 获取单个视频
export const getVideoById = function(id: number) {
    return Http.get(`/videos/${id}`)
}

// 创建视频
export const createVideo = function(videoData: any) {
    return Http.post('/videos', videoData)
}

// 更新视频
export const updateVideo = function(id: number, videoData: any) {
    return Http.put(`/videos/${id}`, videoData)
}

// 删除视频
export const deleteVideo = function(id: number) {
    return Http.delete(`/videos/${id}`)
}

// 上传视频文件
export const uploadVideo = function(file: FormData) {
    return Http.post('/upload/videos', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}