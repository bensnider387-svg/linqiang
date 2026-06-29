import Http from '../http'

// 获取题库列表
export const getQuestionList = function(params?: any) {
    return Http.get('/question-bank/list', params)
};

// 获取题目详情
export const getQuestionDetail = function(id: number) {
    return Http.get(`/question-bank/detail/${id}`)
};

// 添加题目
export const addQuestion = function(params: any) {
    return Http.post('/question-bank/add', params)
};

// 更新题目
export const updateQuestion = function(id: number, params: any) {
    return Http.put(`/question-bank/update/${id}`, params)
};

// 删除题目
export const deleteQuestion = function(id: number) {
    return Http.delete(`/question-bank/delete/${id}`)
};

// 禁用/启用题目
export const toggleQuestionStatus = function(id: number) {
    return Http.put(`/question-bank/toggle/${id}`)
};

// 批量导入题目
export const batchImportQuestions = function(questions: any[]) {
    return Http.post('/question-bank/batch-import', { questions })
};