<template>
  <lay-container fluid="true" class="vip-announcement-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="公告标题" label-width="80">
              <lay-input
                v-model="searchQuery.title"
                placeholder="请输入公告标题"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="公告类型" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.type"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="system" label="系统通知"></lay-select-option>
                <lay-select-option value="activity" label="活动公告"></lay-select-option>
                <lay-select-option value="update" label="更新公告"></lay-select-option>
                <lay-select-option value="other" label="其他类型"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="优先级" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.priority"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="high" label="高"></lay-select-option>
                <lay-select-option value="medium" label="中"></lay-select-option>
                <lay-select-option value="low" label="低"></lay-select-option>
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
        :page="page"
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
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此公告吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['750px', '700px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="公告标题" prop="title" :label-width="140">
            <lay-input v-model="model11.title" placeholder="请输入公告标题"></lay-input>
          </lay-form-item>
          <lay-form-item label="公告内容" prop="content" :label-width="140">
            <lay-textarea v-model="model11.content" placeholder="请输入公告内容" rows="8"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="发布者" prop="publisher" :label-width="140">
            <lay-input v-model="model11.publisher" placeholder="请输入发布者"></lay-input>
          </lay-form-item>
          <lay-form-item label="发布日期" prop="date" :label-width="140">
            <lay-date-picker 
              v-model="model11.date" 
              type="date"
              placeholder="请选择日期"
            ></lay-date-picker>
          </lay-form-item>
          <lay-form-item label="优先级" prop="priority" :label-width="140">
            <lay-select v-model="model11.priority" placeholder="请选择优先级">
              <lay-select-option value="high" label="高"></lay-select-option>
              <lay-select-option value="medium" label="中"></lay-select-option>
              <lay-select-option value="low" label="低"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="公告类型" prop="type" :label-width="140">
            <lay-select v-model="model11.type" placeholder="请选择公告类型">
              <lay-select-option value="system" label="系统通知"></lay-select-option>
              <lay-select-option value="activity" label="活动公告"></lay-select-option>
              <lay-select-option value="update" label="更新公告"></lay-select-option>
              <lay-select-option value="other" label="其他类型"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="是否公开" prop="ispublic" :label-width="140">
            <lay-switch v-model="model11.ispublic" :checked="model11.ispublic === 1" trueValue="1" falseValue="0"></lay-switch>
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
import { getVipAnnouncements, createVipAnnouncement, updateVipAnnouncement, deleteVipAnnouncement } from '../../../api/module/vipAnnouncements'
import type { VipAnnouncement } from '../../../api/module/vipAnnouncements'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 搜索条件
const searchQuery = ref({
  title: '',
  type: '',
  priority: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<VipAnnouncement[]>([])

// 表格列配置
const columns = ref([
 
  { title: 'ID', width: '80px', key: 'id' },
  { title: '公告标题', width: '200px', key: 'title', sort: 'desc' },
  { title: '发布者', width: '120px', key: 'publisher' },
  { title: '发布日期', width: '120px', key: 'date' },
  { title: '优先级', width: '80px', key: 'priority', render: (h: any, params: any) => {
    const priorityMap: {[key: string]: string} = {
      'high': '高',
      'medium': '中',
      'low': '低'
    }
    return priorityMap[params.row.priority] || params.row.priority
  }},
  { title: '公告类型', width: '100px', key: 'type', render: (h: any, params: any) => {
    const typeMap: {[key: string]: string} = {
      'system': '系统通知',
      'activity': '活动公告',
      'update': '更新公告',
      'other': '其他类型'
    }
    return typeMap[params.row.type] || params.row.type
  }},
  { title: '是否公开', width: '100px', key: 'ispublic', customSlot: 'status' },
  { title: '创建时间', width: '150px', key: 'created_at' },
  { title: '操作', width: '150px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  title: '',
  content: '',
  publisher: '',
  date: new Date().toISOString().split('T')[0],
  priority: 'medium',
  type: 'system',
  ispublic: 1,
  trader_uuid: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

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
    type: '',
    priority: ''
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
      type: searchQuery.value.type,
      priority: searchQuery.value.priority
    }
    
    // 调用API获取VIP公告列表
    const { data, success, total } = await getVipAnnouncements(params)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((item: any) => formatDatesForDisplay({
        ...item,
        ispublic: item.ispublic === 1
      }, ['created_at']))
      
      // 处理分页逻辑
      page.total = total || 0;
    } else {
      layer.msg('获取VIP公告列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取VIP公告列表异常:', error)
    layer.msg('获取VIP公告列表异常', { icon: 2 })
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

// 修改公告状态
const changeStatus = async (isChecked: boolean, row: VipAnnouncement) => {
 
  try {
    // 根据isChecked布尔值转换为后端需要的状态数字
    const statusNum = isChecked ? 1 : 0;
    const response = await updateVipAnnouncement(row.id, { ispublic: statusNum })
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
            // 批量删除公告
            for (const announcementId of selectedKeys.value) {
              await deleteVipAnnouncement(Number(announcementId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除公告异常:', error)
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
const changeVisible11 = (text: string, row?: VipAnnouncement) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      title: '',
      content: '',
      publisher: '',
      date: new Date().toISOString().split('T')[0],
      priority: 'medium',
      type: 'system',
      ispublic: 1,
      trader_uuid: ''
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
    
    
    // 表单验证
    if (!model11.value.title) {
      layer.msg('公告标题不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.content) {
      layer.msg('公告内容不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.date) {
      layer.msg('请选择发布日期', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 处理ispublic值
    if(model11.value.ispublic) {
      model11.value.ispublic = 1
    } else {
      model11.value.ispublic = 0
    }
    
    // 创建提交数据对象
    const submitData = {
      title: model11.value.title,
      content: model11.value.content,
      publisher: model11.value.publisher,
      date: model11.value.date,
      priority: model11.value.priority,
      type: model11.value.type,
      ispublic: model11.value.ispublic,
      trader_uuid: model11.value.trader_uuid
    };

    if (model11.value.id) {
      // 编辑公告
      const response = await updateVipAnnouncement(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        loading.value = true
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增公告
      const response = await createVipAnnouncement(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
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
  visible11.value = false
}

// 确认删除单个公告
async function confirm(data: VipAnnouncement) {
  loading.value = true
  try {
    const response = await deleteVipAnnouncement(data.id);
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
    console.error('删除公告异常:', error);
    layer.msg('删除公告异常', { icon: 2 });
  } finally {
    loading.value = false;
  }
}

// 取消删除
function cancel() {
  layer.msg('已取消删除操作', { icon: 0 });
}
</script>

<style scoped>
.vip-announcement-box {
  padding: 16px;
}

.table-box {
  margin-top: 16px;
  height: calc(100vh - 300px);
}

.search-input {
  width: 100%;
}

/* 适配不同屏幕尺寸 */
@media (max-width: 768px) {
  .vip-announcement-box {
    padding: 8px;
  }
  
  .lay-row {
    flex-direction: column;
  }
  
  .lay-col {
    width: 100%;
  }
}
</style>