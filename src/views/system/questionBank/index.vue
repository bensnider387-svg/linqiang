<template>
  <lay-container fluid="true" class="question-bank-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="8">
            <lay-form-item label="搜索关键词" label-width="80">
              <lay-input
                v-model="searchKeyword"
                placeholder="请输入题目关键词搜索"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="4">
            <lay-form-item label-width="20">
              <lay-button
                style="margin-left: 20px"
                type="primary"
                size="sm"
                @click="search"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="reset"> 重置 </lay-button>
            </lay-form-item>
          </lay-col>
        </lay-row>
      </lay-form>
    </lay-card>
    <!-- table -->
    <div class="table-box">
      <lay-table
        :page='page'
        :height="'calc(100% - 70px)'"
        :columns="columns"
        :loading="loading"
        :default-toolbar="false"
        :data-source="dataSource"
        v-model:selected-keys="selectedKeys"
        @change="change"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="showAddDialog">
            <lay-icon class="layui-icon-addition"></lay-icon>
            添加题目
          </lay-button>
          <lay-button size="sm" type="normal" @click="showImportDialog">
            <lay-icon class="layui-icon-upload"></lay-icon>
            批量导入
          </lay-button>
          <lay-button size="sm" border="green" border-style="dashed" @click="downloadTemplate">
            下载Excel模版
          </lay-button>
        </template>
        <template v-slot:scope="{ row }">
          <lay-tag :color="row.is_global ? '#16baaa' : '#1e9fff'" variant="light">
            {{ row.scope_label || (row.is_global ? '全平台' : '专属') }}
          </lay-tag>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            :disabled="!canManageRow(row)"
            @click="showEditDialog(row)"
          >编辑</lay-button>
          <lay-popconfirm
            content="确定要删除此题目吗?"
            @confirm="handleDelete(row)"
            @cancel="cancel"
          >
            <lay-button
              size="xs"
              border="red"
              border-style="dashed"
              danger
              :disabled="!canManageRow(row)"
            >
              删除
            </lay-button>
          </lay-popconfirm>
        </template>
        <template v-slot:question="{ row }">
          <div class="content-preview" @click="showFullContent('题目内容', row.question)">{{ row.question.substring(0, 100) }}{{ row.question.length > 100 ? '...' : '' }}</div>
        </template>
        <template v-slot:image="{ row }">
          <div v-if="row.questionimg && row.questionimg !== ''" @click="viewImage(row.questionimg)" style="cursor: pointer;">
            <img :src="row.questionimg" alt="题目图片" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          </div>
          <span v-else style="color: #999;">无图片</span>
        </template>
        <template v-slot:disable="{ row }">
          {{ row.disable ? '禁用' : '启用' }}
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible" :title="title" :area="['700px', '800px']">
      <div style="padding: 20px">
        <lay-form :model="model" :pane="true" :label-width="140" ref="layFormRef" required>
          <lay-form-item label="题目内容" prop="question">
            <lay-textarea v-model="model.question" placeholder="请输入题目内容" rows="4"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="题目图片" prop="questionimg"  mode="inline" :inlineWidth="350">
            <lay-input v-model="model.questionimg" placeholder="题目图片URL" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-form-item :label-width="100" mode="inline">
            <lay-upload
              :beforeUpload="beforeUploadImage"
              :url="uploadvideosUrl"
              v-model="avatarFile"
              field="file"
              :auto="true"
              @done="handleUploadSuccess"
              mode="inline"
            />
          </lay-form-item>
          <lay-form-item label="选项设置" prop="options">
            <div v-for="(option, index) in model.options" :key="index" style="margin-bottom: 10px; display: flex; align-items: center">
              <span style="width: 20px; text-align: center">{{ String.fromCharCode(65 + index) }}.</span>
              <lay-input v-model="model.options[index]" placeholder="请输入选项内容" style="flex: 1; margin-left: 10px"></lay-input>
              <lay-button v-if="model.options.length > 2" @click="removeOption(index)" size="sm" border="red" border-style="dashed" style="margin-left: 10px;">
                删除
              </lay-button>
            </div>
            <lay-button type="primary" size="sm" @click="addOption">
              <lay-icon class="layui-icon-addition"></lay-icon>
              添加选项
            </lay-button>
          </lay-form-item>
          <lay-form-item label="正确答案" prop="correctAnswer">
            <lay-select v-model="model.correctAnswer" placeholder="请选择正确答案">
              <lay-select-option v-for="(option, index) in model.options" :key="index" :label="String.fromCharCode(65 + index)" :value="index"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="禁用" prop="disable">
            <lay-switch v-model="model.disable" :active-text="'启用'" :inactive-text="'禁用'" checked-color="#1E9FFF" unchecked-color="#FF5722"></lay-switch>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right">
          <lay-button size="sm" type="primary" @click="saveQuestion" :disabled="isSaving">
            <template v-if="!isSaving">保存</template>
            <template v-else>正在保存...</template>
          </lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>

    <lay-layer v-model="importVisible" title="批量导入题目" :area="['760px', '620px']">
      <div style="padding: 20px">
        <div class="import-tip" :class="{ global: isSuperAdmin }">
          <strong>{{ isSuperAdmin ? '超级管理员导入' : '交易员管理员导入' }}</strong>
          <p v-if="isSuperAdmin">导入的题目将同步到所有交易员，所有 VIP 用户都可以做这些题。</p>
          <p v-else>导入的题目仅属于当前交易员，只有本交易员的 VIP 用户可以看到。</p>
          <p>推荐下载 <strong>Excel 模版（CSV）</strong>，用 Excel / WPS 填好后直接导入。也支持 JSON 文件。</p>
          <p>正确答案填 <strong>A / B / C / D</strong>；是否禁用填 <strong>是</strong> 或 <strong>否</strong>；题目图片 URL 可留空。</p>
        </div>
        <input
          ref="importFileInput"
          type="file"
          accept=".csv,.json,text/csv,application/json"
          style="display: none"
          @change="handleImportFileChange"
        />
        <div class="import-actions">
          <lay-button type="primary" size="sm" @click="triggerImportFile">选择 Excel/JSON 文件</lay-button>
          <lay-button size="sm" @click="downloadTemplate">下载Excel模版</lay-button>
        </div>
        <div v-if="importFileName" class="import-file-name">已选择：{{ importFileName }}</div>
        <lay-textarea
          v-model="importPreview"
          placeholder="上传文件后会在这里预览；也可以直接粘贴 CSV 或 JSON 内容"
          rows="12"
          style="margin-top: 12px"
        ></lay-textarea>
        <div style="width: 100%; text-align: right; margin-top: 16px">
          <lay-button size="sm" type="primary" :disabled="isImporting" @click="submitBatchImport">
            <template v-if="!isImporting">开始导入</template>
            <template v-else>正在导入...</template>
          </lay-button>
          <lay-button size="sm" @click="closeImportDialog">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { layer } from '@layui/layui-vue';
import { useUserStore } from '@/store';
import { getQuestionList, addQuestion, updateQuestion, deleteQuestion, toggleQuestionStatus, batchImportQuestions } from '../../../api/module/questionBank';

const userStore = useUserStore();
const isSuperAdmin = computed(() => userStore.userInfo?.role === 'superadmin');
const uploadvideosUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/images":"https://houduan-api.onrender.com/api/upload/images"
// 定义题目接口
interface Question {
  id: number;
  question: string;
  questionimg: string;
  options: string[];
  correctAnswer: number;
  disable: boolean;
  is_global?: boolean;
  scope_label?: string;
  trader_uuid?: string;
  create_time?: string;
  update_time?: string;
}

// 搜索条件
const searchKeyword = ref('');

// 分页信息
const loading = ref(false);
const selectedKeys = ref<string[]>([]);
const page = reactive({ current: 1, limit: 10, total: 0 });
const dataSource = ref<Question[]>([]);

// 表格列配置
const columns = ref([
  
  { title: 'ID', width: '80px', key: 'id' },
  { title: '题目内容', width: '250px', key: 'question', customSlot: 'question' },
  { title: '题目图片', width: '100px', customSlot: 'image', key: 'questionimg' },
  { title: '选项数', width: '100px', key: 'options', formatter: (row: any) => row.options.length },
  { title: '适用范围', width: '110px', key: 'scope_label', customSlot: 'scope' },
  { title: '正确答案', width: '100px', key: 'correctAnswer', formatter: (row: any) => String.fromCharCode(65 + row.correctAnswer) },
  { title: '禁用', width: '100px', key: 'disable', customSlot: 'disable' },
  { title: '创建时间', width: '180px', key: 'create_time' },
  { title: '操作', width: '180px', customSlot: 'operator', key: 'operator', fixed: 'right' }
]);

// 对话框相关
const model = ref<any>({
  id: 0,
  question: '',
  questionimg: '',
  options: ['', ''],
  correctAnswer: 0,
  disable: false
});
const layFormRef = ref();
const visible = ref(false);
const title = ref('新增题目');

// 保存状态
const isSaving = ref(false);

// 图片上传相关
const avatarFile = ref<File | null>(null);

// 批量导入相关
const importVisible = ref(false);
const importPreview = ref('');
const importFileName = ref('');
const isImporting = ref(false);
const importFileInput = ref<HTMLInputElement | null>(null);

const canManageRow = (row: Question) => {
  if (isSuperAdmin.value) return true;
  return !row.is_global;
};

// 初始化加载数据
onMounted(() => {
  change(page);
});

// 重置搜索条件
function reset() {
  searchKeyword.value = '';
  page.current = 1;
  change(page);
}

// 搜索
function search() {
  page.current = 1;
  change(page);
}

// 分页改变时加载数据
const change = async (page: any) => {
  // 使用传入的page对象更新当前分页信息
  if (page) {
    page.current = page.current || 1;
    page.limit = page.limit || 10;
  }

  loading.value = true;
  try {
    // 构建请求参数
    const params = {
      page: page.current,
      pageSize: page.limit,
      keyword: searchKeyword.value
    };
    
    // 调用API获取题目列表
    const response = await getQuestionList(params);
    
    // 确保response对象存在并有正确的格式
    if (response && response.success) {
      // 转换数据格式以适应表格
      dataSource.value = response.data && Array.isArray(response.data.list) 
        ? response.data.list.map((item: any) => ({ ...item })) 
        : [];
      
      // 处理分页逻辑
      page.total = response.data ? response.data.total : 0;
    } else {
      layer.msg(response?.message || '获取题目列表失败', { icon: 2 });
    }
  } catch (error) {
    console.error('获取题目列表异常:', error);
    layer.msg('获取题目列表异常', { icon: 2 });
  } finally {
    loading.value = false;
  }
}

// 处理页码变化
const handlePageChange = (current: number) => {
  page.current = current;
  change(page);
};

// 处理每页条数变化
const handlePageSizeChange = (limit: number) => {
  page.limit = limit;
  page.current = 1; // 重置为第一页
  change(page);
};

// 批量删除
function batchDelete() {
  if (selectedKeys.value.length === 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', { icon: 3, time: 2000 });
    return;
  }
  
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: async (id: any) => {
          loading.value = true;
          try {
            // 批量删除题目
            const results = [];
            let hasError = false;
            
            for (const questionId of selectedKeys.value) {
              try {
                const response = await deleteQuestion(Number(questionId));
                results.push(response);
                if (!response.success) {
                  hasError = true;
                }
              } catch (error) {
                console.error(`删除题目ID ${questionId} 异常:`, error);
                hasError = true;
              }
            }
            
            if (hasError) {
              layer.msg('部分删除失败，请重试', { icon: 2 });
            } else {
              layer.msg('删除成功', { icon: 1 });
              // 刷新数据
              change(page);
              // 清空选择
              selectedKeys.value = [];
            }
          } catch (error) {
            console.error('删除题目异常:', error);
            layer.msg('删除失败', { icon: 2 });
          } finally {
            loading.value = false;
            layer.close(id);
          }
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.close(id);
        }
      }
    ]
  });
}

const showImportDialog = () => {
  importPreview.value = '';
  importFileName.value = '';
  importVisible.value = true;
};

const closeImportDialog = () => {
  importVisible.value = false;
};

const downloadBlobFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
};

const downloadTemplate = async () => {
  try {
    const response = await fetch('/templates/questions-import-template.csv');
    const csvText = await response.text();
    downloadBlobFile(`\uFEFF${csvText}`, '题目批量导入模版.csv', 'text/csv;charset=utf-8;');
  } catch (error) {
    console.error('下载模版失败:', error);
    layer.msg('下载模版失败，请稍后重试', { icon: 2 });
  }
};

const triggerImportFile = () => {
  importFileInput.value?.click();
};

const handleImportFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  importFileName.value = file.name;
  try {
    importPreview.value = await file.text();
  } catch (error) {
    console.error('读取导入文件失败:', error);
    layer.msg('读取文件失败', { icon: 2 });
  } finally {
    input.value = '';
  }
};

const parseCsvLine = (line: string) => {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
      continue;
    }
    current += ch;
  }

  result.push(current.trim());
  return result;
};

const parseCorrectAnswer = (value: string, rowIndex: number) => {
  const raw = String(value || '').trim().toUpperCase();
  if (/^[A-J]$/.test(raw)) {
    return raw.charCodeAt(0) - 65;
  }
  const num = parseInt(raw, 10);
  if (!Number.isNaN(num)) {
    return num;
  }
  throw new Error(`第 ${rowIndex} 行：正确答案请填写 A/B/C/D`);
};

const parseDisableFlag = (value: string) => {
  const raw = String(value || '').trim().toLowerCase();
  if (!raw || raw === '否' || raw === 'false' || raw === '0' || raw === 'no') {
    return false;
  }
  if (raw === '是' || raw === 'true' || raw === '1' || raw === 'yes') {
    return true;
  }
  return false;
};

const parseCsvQuestions = (raw: string) => {
  const lines = raw
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    throw new Error('CSV 文件中没有可导入的题目');
  }

  const firstLine = lines[0].toLowerCase();
  const hasHeader = firstLine.includes('题目内容') || firstLine.includes('选项a') || firstLine.includes('optiona');
  const startIndex = hasHeader ? 1 : 0;

  if (lines.length <= startIndex) {
    throw new Error('CSV 文件中没有可导入的题目');
  }

  const questions = [];
  for (let i = startIndex; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const question = cols[0] || '';
    const options = cols.slice(1, 5).map((item) => item.trim()).filter(Boolean);
    const correctAnswer = parseCorrectAnswer(cols[5], i + 1);
    const questionimg = cols[6] || '';
    const disable = parseDisableFlag(cols[7]);

    if (!question) {
      continue;
    }
    if (options.length < 2) {
      throw new Error(`第 ${i + 1} 行：至少需要 2 个选项`);
    }
    if (correctAnswer < 0 || correctAnswer >= options.length) {
      throw new Error(`第 ${i + 1} 行：正确答案超出选项范围`);
    }

    questions.push({
      question,
      questionimg,
      options,
      correctAnswer,
      disable,
    });
  }

  if (questions.length === 0) {
    throw new Error('CSV 文件中没有有效题目');
  }

  return questions;
};

const parseImportQuestions = () => {
  const raw = importPreview.value.trim();
  if (!raw) {
    throw new Error('请先上传文件或粘贴题目内容');
  }

  const fileName = importFileName.value.toLowerCase();
  const looksLikeCsv = fileName.endsWith('.csv') || (!raw.startsWith('[') && raw.includes(',') && raw.includes('题目内容'));

  if (looksLikeCsv) {
    return parseCsvQuestions(raw);
  }

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error('JSON 格式错误，根节点必须是数组');
  }
  if (parsed.length === 0) {
    throw new Error('题目数组不能为空');
  }
  return parsed;
};

const IMPORT_BATCH_SIZE = 100;

const submitBatchImport = async () => {
  if (isImporting.value) return;

  try {
    const questions = parseImportQuestions();
    isImporting.value = true;

    let totalImported = 0;
    let totalFailed: Array<{ index: number; question: string; message: string }> = [];
    let scopeLabel = '';

    for (let start = 0; start < questions.length; start += IMPORT_BATCH_SIZE) {
      const chunk = questions.slice(start, start + IMPORT_BATCH_SIZE);
      const response = await batchImportQuestions(chunk);
      if (!response.success) {
        throw new Error(response.message || `第 ${start + 1} 批导入失败`);
      }
      totalImported += response.data?.imported || 0;
      scopeLabel = response.data?.scope_label || scopeLabel;
      if (Array.isArray(response.data?.failed) && response.data.failed.length) {
        totalFailed = totalFailed.concat(
          response.data.failed.map((item: any) => ({
            ...item,
            index: (item.index || 0) + start,
          }))
        );
      }
    }

    layer.msg(
      `成功导入 ${totalImported} 道题目${scopeLabel ? `（${scopeLabel}）` : ''}${totalFailed.length ? `，失败 ${totalFailed.length} 道` : ''}`,
      { icon: 1, time: 3000 }
    );
    importVisible.value = false;
    change(page);
  } catch (error: any) {
    console.error('批量导入异常:', error);
    const status = error?.response?.status;
    if (status === 413) {
      layer.msg('上传内容过大，请减少单次题目数量后重试', { icon: 2 });
    } else if (status === 500) {
      layer.msg('服务器处理失败，请确认后端已重启后重试', { icon: 2 });
    } else {
      layer.msg(error?.response?.data?.message || error?.message || '批量导入失败，请检查文件格式', { icon: 2 });
    }
  } finally {
    isImporting.value = false;
  }
};

// 显示添加弹窗
const showAddDialog = () => {
  title.value = '新增题目';
  // 新增模式，清空表单
  model.value = {
    id: 0,
    question: '',
    questionimg: '',
    options: ['', ''],
    correctAnswer: 0,
    disable: false
  };
  visible.value = true;
};

// 显示编辑弹窗
const showEditDialog = async (row: Question) => {
  if (!canManageRow(row)) {
    layer.msg('全平台题目仅超级管理员可编辑', { icon: 3 });
    return;
  }
  try {
    model.value = {
        ...row,
       
      };
      title.value = '编辑题目';
      visible.value = true;
  } catch (error) {
    console.error('获取题目详情异常:', error);
    layer.msg('获取题目详情异常', { icon: 2 });
  }
};

// 添加选项
function addOption() {
  if (model.value.options.length < 10) {
    model.value.options.push('');
  } else {
    layer.msg('最多只能添加10个选项', { icon: 3 });
  }
}

// 删除选项
function removeOption(index: number) {
  if (model.value.options.length > 2) {
    model.value.options.splice(index, 1);
    // 如果删除的是当前选中的正确答案，重置正确答案
    if (model.value.correctAnswer === index) {
      model.value.correctAnswer = 0;
    }
    // 如果删除后正确答案超出范围，调整正确答案
    else if (model.value.correctAnswer > index) {
      model.value.correctAnswer--;
    }
  } else {
    layer.msg('至少保留两个选项', { icon: 3 });
  }
}

// 保存题目
async function saveQuestion() {
  // 防止重复提交
  if (isSaving.value) {
    return;
  }
  
  try {
    // 设置保存状态
    isSaving.value = true;
    
    // 表单验证
    if (!model.value.question.trim()) {
      layer.msg('题目内容不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 验证选项
    const validOptions = model.value.options.filter((option: string) => option.trim() !== '');
    if (validOptions.length < 2) {
      layer.msg('至少需要2个有效的选项', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 验证正确答案
    if (model.value.correctAnswer === undefined || model.value.correctAnswer < 0 || model.value.correctAnswer >= model.value.options.length) {
      layer.msg('请选择正确的答案', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      question: model.value.question,
      questionimg: model.value.questionimg,
      options: model.value.options.filter((option: string) => option.trim() !== ''),
      correctAnswer: model.value.correctAnswer,
      disable: model.value.disable
    };
    
    let response;
    if (model.value.id) {
      // 编辑题目
      response = await updateQuestion(model.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增题目
      response = await addQuestion(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '新增失败', { icon: 2 });
      }
    }
  } catch (error) {
    console.error('保存题目异常:', error);
    layer.msg('操作异常', { icon: 2 });
  } finally {
    // 重置保存状态
    isSaving.value = false;
  }
}

// 关闭对话框
function toCancel() {
  visible.value = false;
}

// 确认删除单个题目
async function handleDelete(data: Question) {
  if (!canManageRow(data)) {
    layer.msg('全平台题目仅超级管理员可删除', { icon: 3 });
    return;
  }
  loading.value = true;
  try {
    const response = await deleteQuestion(data.id);
    if (response.success) {
      layer.msg(response.message || '删除成功', { icon: 1 });
      // 刷新数据
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除题目异常:', error);
    layer.msg('删除题目异常', { icon: 2 });
  } finally {
    loading.value = false;
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作');
}

// 切换题目状态
const handleToggleStatus = async (row: Question) => {
  layer.confirm(
    `确定要${row.disable ? '启用' : '禁用'}该题目吗？`,
    { icon: 3, title: '提示' },
    async () => {
      try {
        const response = await toggleQuestionStatus(row.id);
        if (response.success) {
          layer.msg(response.message || '操作成功', { icon: 1 });
          // 刷新数据
          change(page);
        } else {
          layer.msg(response.message || '操作失败', { icon: 2 });
        }
      } catch (error) {
        console.error('切换题目状态异常:', error);
        layer.msg('切换题目状态异常', { icon: 2 });
      }
    }
  );
};

// 图片上传前校验
const beforeUploadImage = (file: File) => {
  layer.load(0, {time: 3000});
  const isImage = file.type.indexOf('image/') === 0;
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isImage) {
    layer.msg('上传文件只能是图片格式!', { icon: 2 });
    return false;
  }
  if (!isLt2M) {
    layer.msg('上传图片大小不能超过 2MB!', { icon: 2 });
    return false;
  }
  return true;
};

// 图片上传成功处理
const handleUploadSuccess = (response: any) => {
  layer.closeAll();
  try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      // 将上传成功后的图片URL赋值给questionimg字段
      model.value.questionimg = updataData.data.url;
      layer.msg('上传成功', { icon: 1 });
    } else {
      layer.msg('上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('上传失败，请重试', { icon: 2 });
  }
};

// 显示完整内容
function showFullContent(title: string, content: string) {
  layer.open({
    type: 1,
    title: title,
    area: ['600px', '400px'],
    content: `<div style="padding: 20px; max-height: 340px; overflow-y: auto;">${content}</div>`
  });
}

// 查看图片放大
function viewImage(imageUrl: string) {
  if (!imageUrl) {
    layer.msg('暂无图片', { icon: 3 });
    return;
  }
  
  layer.photos({
    imgList:[{src:imageUrl,alt:'题目图片'}]
  });
}
</script>

<style scoped>
.question-bank-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: calc(100% - 100px);
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}

.content-preview {
  cursor: pointer;
  color: #1890ff;
}

.content-preview:hover {
  text-decoration: underline;
}

.import-tip {
  margin-bottom: 14px;
  padding: 12px 14px;
  border-radius: 8px;
  background: #f0f7ff;
  border: 1px solid #d6e8ff;
  color: #334155;
  line-height: 1.6;
}

.import-tip.global {
  background: #f0fdf4;
  border-color: #bbf7d0;
}

.import-tip p {
  margin: 6px 0 0;
}

.import-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.import-file-name {
  margin-top: 10px;
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 768px) {
  .lay-input {
    width: 100% !important;
    margin-right: 0 !important;
    margin-bottom: 10px;
  }
}
</style>