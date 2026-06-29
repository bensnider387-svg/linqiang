<template>
  <lay-container fluid="true" class="document-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="文档标题" label-width="80">
              <lay-input
                v-model="searchQuery.title"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="文档状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.ispublic"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="" label="全部"></lay-select-option>
                <lay-select-option value="1" label="公开"></lay-select-option>
                <lay-select-option value="0" label="不公开"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label-width="20">
              <lay-button
                style="margin-left: 20px"
                type="primary"
                size="sm"
                @click="toSearch"
              >
                查询
              </lay-button>
              <lay-button size="sm" @click="toReset"> 重置 </lay-button>
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
        @sort-change="sortChange"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button
          >
         
        </template>
        <template v-slot:status="{ row }">
          <lay-switch v-model="row.ispublic" :checked="row.ispublic === 1" @change="changeStatus($event, row)" trueValue="1" falseValue="0"></lay-switch>
        </template>
        <template v-slot:fileType="{ row }">
          <span>{{ formatFileType(row.file_type) }}</span>
        </template>
        <template v-slot:last_update="{ row }">
          <span>{{ formatUSDate(row.last_update) }}</span>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此文档吗?"
            @confirm="confirm(row)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['750px', '550px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
          <lay-form-item label="文档标题" prop="title" :label-width="140">
            <lay-input v-model="model11.title" placeholder="请输入文档标题"></lay-input>
          </lay-form-item>
          <lay-form-item label="文档描述" prop="description" :label-width="140">
            <lay-textarea v-model="model11.description" placeholder="请输入文档描述"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="文档地址" prop="file_url"  mode="inline" :label-width="140" :inlineWidth="450">
            <lay-input v-model="model11.file_url" placeholder="文档地址" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUploadDocument"
            :url="uploaddocumentsUrl"
            v-model="documentFile"
            field="file"
            :auto="true"
            @done="handleDocumentUploadSuccess"
            mode="inline"
          />
          <lay-form-item label="是否公开" prop="ispublic" :label-width="140">
            <lay-switch v-model="model11.ispublic" :checked="model11.ispublic === 1" trueValue="1" falseValue="0"></lay-switch>
          </lay-form-item>
          <lay-form-item v-if="model11.id" label="最后更新" :label-width="140">
            <input
              v-model="model11.last_update"
              type="datetime-local"
              class="layui-input"
              style="width: 100%; height: 38px; padding: 0 10px; border: 1px solid #eee; border-radius: 4px;"
            />
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit" :disabled="isSaving">
            <span v-if="!isSaving">保存</span>
            <span v-else>正在保存...</span>
          </lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { getDocuments, createDocument, updateDocument, deleteDocument, uploadDocument } from '@/api/module/documents'
import { getUploadUrl, parseUploadResponse, isAllowedDocumentFile } from '@/utils/apiUrl'
import { formatUSDate, formatDateTimeLocalInput, toApiDateTime } from '@/utils/dateFormat'

const uploaddocumentsUrl = getUploadUrl('documents')
// 定义文档接口
interface Document {
  id: number;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  views: number;
  trader_uuid?: string;
  ispublic: number;
  last_update: string;
}

// 搜索条件
const searchQuery = ref({
  title: '',
  ispublic: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<Document[]>([])

// 表格列配置
const columns = ref([
 
  { title: 'ID', width: '80px', key: 'id' },
  { title: '文档标题', width: '200px', key: 'title', sort: 'desc' },
  { title: '文档描述', width: '300px', key: 'description' },
  { title: '文件类型', width: '100px', key: 'file_type', customSlot: 'fileType' },
  { title: '查看次数', width: '100px', key: 'views' },
  { title: '是否公开', width: '100px', key: 'ispublic', customSlot: 'status' },
  { title: '最后更新', width: '150px', key: 'last_update', customSlot: 'last_update' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  title: '',
  description: '',
  file_url: '',
  file_type: '',
  ispublic: 1
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 保存状态
const isSaving = ref(false)

// 文档上传相关
const documentFile = ref<any>([])
const uploading = ref(false)

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    title: '',
    ispublic: ''
  }
  page.current = 1
  change(page)
}

// 搜索
function toSearch() {
  page.current = 1
  change(page)
}

// 分页改变时加载数据
const change = async (page: any) => {
  // 使用传入的page对象更新当前分页信息
  if (page) {
    page.current = page.current || 1;
    page.limit = page.limit || 10;
  }

  loading.value = true
  try {
    // 构建请求参数
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.title,
      ispublic: searchQuery.value.ispublic
    }
    
    // 调用API获取文档列表
    const { data, success, total } = await getDocuments(params)
    console.log(data)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((item: any) => ({
        ...item,
        ispublic: item.ispublic === 1
      }))
      
      // 处理分页逻辑
      page.total = total || 0;
     loading.value = false;
    } else {
      layer.msg('获取文档列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取文档列表异常:', error)
    layer.msg('获取文档列表异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 处理页码变化
const handlePageChange = (current: number) => {
  page.current = current;
  change(page);
}

// 处理每页条数变化
const handlePageSizeChange = (limit: number) => {
  page.limit = limit;
  page.current = 1; // 重置为第一页
  change(page);
}

// 排序
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}

// 修改文档状态
const changeStatus = async (isChecked: boolean, row: Document) => {
  
  try {
    // 根据isChecked布尔值转换为后端需要的状态数字
    const statusNum = isChecked ? 1 : 0;
    const response = await updateDocument(row.id, { ispublic: statusNum })
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
      // 更新本地数据
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].ispublic = statusNum
      }
      loading.value = true
      change(page)
    } else {
      layer.msg(response.message || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].ispublic = row.ispublic
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].ispublic = row.ispublic
    }
  } finally {
    loading.value = false
  }
}

// 批量删除
function toRemove() {
  if (selectedKeys.value.length === 0) {
    layer.msg('您未选择数据，请先选择要删除的数据', { icon: 3, time: 2000 })
    return
  }
  
  layer.confirm('您将删除所有选中的数据？', {
    title: '提示',
    btn: [
      {
        text: '确定',
        callback: async (id: any) => {
          loading.value = true
          try {
            // 批量删除文档
            for (const documentId of selectedKeys.value) {
              await deleteDocument(Number(documentId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除文档异常:', error)
            layer.msg('删除失败', { icon: 2 })
          } finally {
            loading.value = false
            layer.close(id)
          }
        }
      },
      {
        text: '取消',
        callback: (id: any) => {
          layer.close(id)
        }
      }
    ]
  })
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: Document) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据并格式化时间
    model11.value = { 
      ...row,
      last_update: row.last_update ? formatDateTimeLocalInput(row.last_update) : formatDateTimeLocalInput(new Date())
    }
  } else {
    // 新增模式，清空表单并设置当前时间
    model11.value = {
      id: 0,
      title: '',
      description: '',
      file_url: '',
      file_type: '',
      ispublic: 1,
      last_update: formatDateTimeLocalInput(new Date())
    }
  }
  if(model11.value.ispublic==1)
  {
    model11.value.ispublic=true;
  }
  else
  {
    model11.value.ispublic=0;
  }
  console.log(model11)
  visible11.value = true
}

// 提交表单
async function toSubmit() {
  // 防止重复提交
  if (isSaving.value) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    // 检查是否还在上传中
    if (uploading.value) {
      layer.msg('文件正在上传中，请稍候再试', { icon: 3 });
      isSaving.value = false;
      return;
    }
   
    // 表单验证
    if (!model11.value.title) {
      layer.msg('文档标题不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.file_url) {
      layer.msg('请上传文档文件', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      title: model11.value.title,
      description: model11.value.description,
      file_url: model11.value.file_url,
      file_type: model11.value.file_type,
      ispublic: model11.value.ispublic,
      last_update: toApiDateTime(model11.value.last_update) || new Date().toISOString()
    };
    if(submitData.ispublic)
    {
      submitData.ispublic =1;
    }
    else
    {
       submitData.ispublic =0;
    }
    
    if (model11.value.id) {
      // 编辑文档
      const response = await updateDocument(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        toReset();
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增文档
      const response = await createDocument(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
        toReset();
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '新增失败', { icon: 2 });
      }
    }
  } catch (error) {
    console.error('提交表单异常:', error);
    layer.msg('操作异常', { icon: 2 });
  } finally {
    isSaving.value = false;
  }
}

// 关闭对话框
function toCancel() {
  // 重置上传状态
  uploading.value = false;
  documentFile.value = null;
  // 重置表单数据
  toReset();
  visible11.value = false;
}

// 确认删除单个文档
async function confirm(data: Document) {
 
  try {
    const response = await deleteDocument(data.id);
    if (response.success) {
      layer.msg('删除成功', { icon: 1 });
      loading.value = true
      // 刷新数据
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除文档异常:', error);
    layer.msg('删除文档异常', { icon: 2 });
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 格式化文件类型显示
function formatFileType(mimeType: string): string {
  const typeMap: {[key: string]: string} = {
    'application/pdf': 'PDF',
    'application/msword': 'Word',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'Word',
    'application/vnd.ms-excel': 'Excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'Excel',
    'application/zip': 'ZIP',
    'application/x-rar-compressed': 'RAR'
  };
  return typeMap[mimeType] || mimeType.split('/')[1] || '未知';
}

// 文档上传前校验
const beforeUploadDocument = (file: File) => {
  if (file.size > 200 * 1024 * 1024) {
    layer.msg('文件大小超过200MB', { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }

  if (!isAllowedDocumentFile(file)) {
    layer.msg(`不支持的文件类型: ${file.type || file.name}`, { icon: 2 });
    return new Promise((resolver) => resolver(false));
  }
  
  uploading.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理文档上传成功后的回调
function handleDocumentUploadSuccess(response: any) {
  layer.closeAll()
  uploading.value = false;
  
  const updataData = parseUploadResponse(response);
  if (updataData?.success && updataData.data?.url) {
    model11.value.file_url = updataData.data.url;
    model11.value.file_type = updataData.data.mimeType || '';
    layer.msg('文档上传成功', { icon: 1 });
    documentFile.value = null;
    return;
  }

  layer.msg(updataData?.error || '文档上传失败', { icon: 2 });
  documentFile.value = null;
  uploading.value = false;
}
</script>

<style scoped>
.document-box {
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

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}

.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>