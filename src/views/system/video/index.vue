<template>
  <lay-container fluid="true" class="video-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="视频标题" label-width="80">
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
            <lay-form-item label="视频状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.ispublic"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="1" label="公开"></lay-select-option>
                <lay-select-option value="0" label="私有"></lay-select-option>
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
            content="确定要删除此视频吗?"
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
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="视频标题" prop="title">
            <lay-input v-model="model11.title" placeholder="请输入视频标题"></lay-input>
          </lay-form-item>
          <lay-form-item label="视频描述" prop="description">
            <lay-textarea v-model="model11.description" placeholder="请输入视频描述"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="视频地址" prop="video_url"  mode="inline" >
            <lay-input v-model="model11.video_url" placeholder="视频地址" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUploadVideo"
            :url="uploadvideosUrl"
            v-model="videoFile"
            field="file"
            :auto="true"
            @done="handleVideoUploadSuccess"
            mode="inline"
          />
          <lay-form-item label="是否公开" prop="ispublic">
            <lay-switch v-model="model11.ispublic" :checked="model11.ispublic === 1" trueValue="1" falseValue="0"></lay-switch>
          </lay-form-item>
          <lay-form-item label="最后更新" prop="last_update" v-if="model11.id">
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
import { getVideos, createVideo, updateVideo, deleteVideo } from '../../../api/module/videos'
import { getUploadUrl, parseUploadResponse, isAllowedVideoFile } from '@/utils/apiUrl'
import { formatUSDate, formatDateTimeLocalInput, toApiDateTime } from '@/utils/dateFormat'

const uploadvideosUrl = getUploadUrl('videos')
// 定义视频接口
interface Video {
  id: number;
  title: string;
  description: string;
  video_url: string;
  last_update: string;
  trader_uuid?: string;
  ispublic: number;
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
const dataSource = ref<Video[]>([])

// 表格列配置
const columns = ref([

  { title: 'ID', width: '80px', key: 'id' },
  { title: '视频标题', width: '200px', key: 'title', sort: 'desc' },
  { title: '视频描述', width: '300px', key: 'description' },
  { title: '视频地址', width: '250px', key: 'video_url' },
  { title: '是否公开', width: '100px', key: 'ispublic', customSlot: 'status' },
  { title: '最后更新', width: '150px', key: 'last_update', customSlot: 'last_update' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  title: '',
  description: '',
  video_url: '',
  ispublic: 1,
  last_update: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
// 视频上传相关
const videoFile = ref<any>([])
const uploading = ref(false)

// 保存状态
const isSaving = ref(false)

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
    
    // 调用API获取视频列表
    const { data, success, total } = await getVideos(params)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((item: any) => ({
        ...item,
        ispublic: item.ispublic === 1
      }))
      
      // 处理分页逻辑
      page.total = total || 0;
    } else {
      layer.msg('获取视频列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取视频列表异常:', error)
    layer.msg('获取视频列表异常', { icon: 2 })
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

// 修改视频状态
const changeStatus = async (isChecked: boolean, row: Video) => {
 
  try {
    // 根据isChecked布尔值转换为后端需要的状态数字
    const statusNum = isChecked ? 1 : 0;
    const response = await updateVideo(row.id, { ispublic: statusNum })
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
       loading.value = true
       change(page);
      // 更新本地数据
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].ispublic = statusNum
      }
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
            // 批量删除视频
            for (const videoId of selectedKeys.value) {
              await deleteVideo(Number(videoId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除视频异常:', error)
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
const changeVisible11 = (text: string, row?: Video) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据并格式化时间
    model11.value = { 
      ...row, 
      last_update: row.last_update ? formatDateTimeLocalInput(row.last_update) : formatDateTimeLocalInput(new Date())
    }
  } else {
    // 新增模式，设置当前时间
    model11.value = {
      id: 0,
      title: '',
      description: '',
      video_url: '',
      ispublic: 1,
      last_update: formatDateTimeLocalInput(new Date())
    }
  }
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
      layer.msg('视频标题不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.video_url) {
      layer.msg('请上传视频文件', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      title: model11.value.title,
      description: model11.value.description,
      video_url: model11.value.video_url,
      ispublic: model11.value.ispublic,
      last_update: toApiDateTime(model11.value.last_update) || new Date().toISOString()
    };
    if(submitData.ispublic)
    {
      submitData.ispublic = 1
    }
    else
    {
      submitData.ispublic = 0
    }
    if (model11.value.id) {
      // 编辑视频
      const response = await updateVideo(model11.value.id, submitData);
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
      // 新增视频
      const response = await createVideo(submitData);
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
  videoFile.value = null;
  // 重置表单数据
  toReset();
  visible11.value = false;
}

// 确认删除单个视频
async function confirm(data: Video) {
  loading.value = true
  try {
    const response = await deleteVideo(data.id);
    if (response.success) {
      layer.msg('删除成功', { icon: 1 });
      // 刷新数据
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除视频异常:', error);
    layer.msg('删除视频异常', { icon: 2 });
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 视频上传前校验
const beforeUploadVideo = (file: File) => {
  if (file.size > 200 * 1024 * 1024) {
    layer.msg('文件大小超过200MB', { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }

  if (!isAllowedVideoFile(file)) {
    layer.msg(`不支持的文件类型: ${file.type || file.name}`, { icon: 2 });
    return new Promise((resolver) => resolver(false));
  }
  
  uploading.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理视频上传成功后的回调
function handleVideoUploadSuccess(response: any) {
  layer.closeAll()
  uploading.value = false;
  
  const updataData = parseUploadResponse(response);
  if (updataData?.success && updataData.data?.url) {
    model11.value.video_url = updataData.data.url;
    layer.msg('视频上传成功', { icon: 1 });
    videoFile.value = null;
    return;
  }

  layer.msg(updataData?.error || '视频上传失败', { icon: 2 });
  videoFile.value = null;
  uploading.value = false;
}
</script>

<style scoped>
.video-box {
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