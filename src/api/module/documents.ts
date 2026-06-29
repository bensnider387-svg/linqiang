import Http from '../http'

// 获取文档列表
export const getDocuments = function(params?: any) {
    return Http.get('/documents', params)
}

// 获取单个文档
export const getDocumentById = function(id: number) {
    return Http.get(`/documents/${id}`)
}

// 创建文档
export const createDocument = function(documentData: any) {
    return Http.post('/documents', documentData)
}

// 更新文档
export const updateDocument = function(id: number, documentData: any) {
    return Http.put(`/documents/${id}`, documentData)
}

// 删除文档
export const deleteDocument = function(id: number) {
    return Http.delete(`/documents/${id}`)
}

// 上传文档文件
export const uploadDocument = function(file: FormData) {
    return Http.post('/upload/documents', file, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}