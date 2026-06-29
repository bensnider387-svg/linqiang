<template>
  <lay-container fluid="true" class="video-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="搜索" label-width="40">
              <lay-input
                v-model="searchQuery.search"
                placeholder="搜索设备指纹、代理ID或用户代理"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="状态" label-width="40">
              <lay-select
                v-model="searchQuery.status"
                placeholder="请选择"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              >
                <lay-select-option value="pending">待处理</lay-select-option>
                <lay-select-option value="resolved">已解决</lay-select-option>
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
        @sortChange="sortChange"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button
          >
       
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此联系记录吗?"
            @confirm="confirmDelete(row.id)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
        <template v-slot:status="{ row }">
          <lay-switch v-model="row.status" :checked="row.status === 'resolved'" @change="changeStatus($event, row)" trueValue="resolved" falseValue="pending" active-text="已解决" inactive-text="待处理"></lay-switch>
        </template>
        <template v-slot:user_agent="{ row }">
          <div class="message-cell" @mouseenter="showTooltip($event, row.user_agent)" @mouseleave="hideTooltip">
            {{ truncateText(row.user_agent, 30) }}
          </div>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['600px', '500px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="设备指纹" prop="device_fingerprint">
            <lay-input v-model="model11.device_fingerprint"></lay-input>
          </lay-form-item>
          <lay-form-item label="代理ID" prop="agent_id">
            <lay-input v-model="model11.agent_id"></lay-input>
          </lay-form-item>
          <lay-form-item label="IP地址" prop="ip_address">
            <lay-input v-model="model11.ip_address"></lay-input>
          </lay-form-item>
          <lay-form-item label="用户代理" prop="user_agent">
            <lay-textarea v-model="model11.user_agent" :rows="3"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="点击时间" prop="click_time">
            <lay-input v-model="model11.click_time" type="datetime"></lay-input>
          </lay-form-item>
          <lay-form-item label="状态" prop="status">
            <lay-switch v-model="model11.status" :checked="model11.status === 'resolved'" trueValue="resolved" falseValue="pending" active-text="已解决" inactive-text="待处理"></lay-switch>
          </lay-form-item>
          <lay-form-item label="处理人" prop="handled_by">
            <lay-input v-model="model11.handled_by"></lay-input>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: center">
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
import { getContactRecords, getContactRecordById, createContactRecord, updateContactRecord, deleteContactRecord } from '../../../api/module/contactRecords'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 定义联系记录接口 - 与数据库表结构匹配
interface ContactRecord {
  id: string;
  device_fingerprint: string;
  agent_id: string;
  ip_address?: string;
  user_agent?: string;
  click_time?: string;
  "timestamp": string;
  trader_uuid?: string;
  status?: string;
  handled_by?: string | null;
}

// 搜索条件
const searchQuery = ref({
  search: '',
  status: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<ContactRecord[]>([])

// 表格列配置 - 与数据库字段匹配
const columns = ref([
  
  { title: '设备指纹', width: '120px', key: 'device_fingerprint' },
  { title: '代理ID', width: '100px', key: 'agent_id' },
  { title: 'IP地址', width: '120px', key: 'ip_address' },
  { title: '用户代理', width: '200px', customSlot: 'user_agent', key: 'user_agent' },
  { title: '点击时间', width: '160px', key: 'click_time' },
  { title: '时间戳', width: '160px', key: 'timestamp' },
  { title: '状态', width: '100px', customSlot: 'status', key: 'status' },
  { title: '处理人', width: '100px', key: 'handled_by' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const tooltip = ref<any>(null)

// 保存状态
const isSaving = ref(false)

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 获取状态对应的文本
function getStatusText(status: string): string {
  const statusMap: Record<string, string> = {
    'pending': '待处理',
    'resolved': '已解决'
  }
  return statusMap[status] || status
}

// 获取状态对应的样式类
function getStatusClass(status: string): string {
  const classMap: Record<string, string> = {
    'pending': 'status-pending',
    'resolved': 'status-resolved'
  }
  return classMap[status] || ''
}

// 截断文本
function truncateText(text: string, maxLength: number): string {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

// 显示消息提示
function showTooltip(event: MouseEvent, message: string) {
  if (!message || message.length <= 30) return
  
  // 创建提示元素
  tooltip.value = document.createElement('div')
  tooltip.value.className = 'custom-tooltip'
  tooltip.value.innerText = message
  tooltip.value.style.position = 'absolute'
  tooltip.value.style.zIndex = '9999'
  tooltip.value.style.background = 'rgba(0, 0, 0, 0.8)'
  tooltip.value.style.color = 'white'
  tooltip.value.style.padding = '8px 12px'
  tooltip.value.style.borderRadius = '4px'
  tooltip.value.style.maxWidth = '300px'
  tooltip.value.style.whiteSpace = 'normal'
  tooltip.value.style.wordBreak = 'break-word'
  
  const target = event.target as HTMLElement
  const rect = target.getBoundingClientRect()
  
  tooltip.value.style.left = `${rect.left + window.pageXOffset}px`
  tooltip.value.style.top = `${rect.bottom + window.pageYOffset + 5}px`
  
  document.body.appendChild(tooltip.value)
}

// 隐藏消息提示
function hideTooltip() {
  if (tooltip.value) {
    document.body.removeChild(tooltip.value)
    tooltip.value = null
  }
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    search: '',
    status: ''
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
    // 构建请求参数，确保与后端接口匹配
    const params = {
      offset: (page.current - 1) * page.limit,
      limit: page.limit,
      search: searchQuery.value.search
    }
    
    // 调用API获取联系记录列表
    const response = await getContactRecords(params)
    if (response && response.success && response.data) {
      const rows = Array.isArray(response.data?.items)
        ? response.data.items
        : Array.isArray(response.data)
          ? response.data
          : []
      dataSource.value = rows.map((item: any) =>
        formatDatesForDisplay(item, ['click_time', 'timestamp'])
      )
      page.total = response.data.total || 0;
    } else {
      layer.msg('获取联系记录列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取联系记录列表异常:', error)
    layer.msg('获取联系记录列表异常', { icon: 2 })
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
            // 批量删除联系记录
            for (const recordId of selectedKeys.value) {
              await deleteContactRecord(recordId)
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            loading.value = true
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除联系记录异常:', error)
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

// 确认删除单个联系记录
async function confirmDelete(id: string) {
  loading.value = true
  try {
    const response = await deleteContactRecord(id);
    loading.value = false;
    if (response && response.success) {
      layer.msg('删除成功', { icon: 1 });
      // 刷新数据
      loading.value = true;
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response?.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除联系记录异常:', error)
    layer.msg('删除异常', { icon: 2 });
    loading.value = false;
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: ContactRecord) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      device_fingerprint: '',
      agent_id: '',
      ip_address: '',
      user_agent: '',
      click_time: '',
      status: 'pending',
      handled_by: null
    }
  }
  visible11.value = true
}

// 提交表单
async function toSubmit() {
  // 防止重复提交
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    // 表单验证
    if (!model11.value.device_fingerprint || !model11.value.agent_id) {
      layer.msg('设备指纹和代理ID不能为空', { icon: 3 });
      isSaving.value = false
      return;
    }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = { ...model11.value };
    
    // 添加当前登录用户的trader_uuid
    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (currentUser.trader_uuid) {
      submitData.trader_uuid = currentUser.trader_uuid;
    }
    
    // 如果当前是编辑模式，且状态改变为已解决但处理人为空，则设置当前用户为处理人
    if (model11.value.id && model11.value.status === 'resolved' && !model11.value.handled_by) {
      submitData.handled_by = currentUser.username || 'admin';
    }
    
    loading.value = true;
    if (model11.value.id) {
      // 编辑联系记录
      const result = await updateContactRecord(model11.value.id, submitData);
      if (result && result.success) {
        layer.msg('更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        loading.value = true;
        change(page);
      } else {
        layer.msg(result?.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增联系记录
      const result = await createContactRecord(submitData);
      if (result && result.success) {
        layer.msg('新增成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        loading.value = true;
        change(page);
      } else {
        layer.msg(result?.message || '新增失败', { icon: 2 });
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

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 修改联系记录状态
const changeStatus = async (isChecked: boolean, row: ContactRecord) => {
  try {
    // 根据isChecked布尔值转换为后端需要的状态
    const statusText = isChecked ? 'resolved' : 'pending';
    loading.value = true
    const response = await updateContactRecord(row.id, { status: statusText })
    if (response && response.success) {
      layer.msg('状态更新成功', { icon: 1 })
      // 更新本地数据
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].status = statusText
        // 如果状态改变为已解决但处理人为空，则设置当前用户为处理人
        if (statusText === 'resolved' && !dataSource.value[index].handled_by) {
          const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
          dataSource.value[index].handled_by = currentUser.username || 'admin';
        }
      }
    } else {
      layer.msg(response?.message || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].status = row.status
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].status = row.status
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.video-box {
  height: calc(100vh - 110px);
  margin-top: 10px;
  box-sizing: border-box;
  overflow: hidden;
}

.top-search {
  margin-top: 10px;
  padding: 10px;
  height: 40px;
  border-radius: 4px;
  background-color: #fff;
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

/* 状态样式 */
.status-pending {
  color: #ff6b35;
}

.status-processing {
  color: #0396ff;
}

.status-resolved {
  color: #52c41a;
}

/* 消息单元格样式 */
.message-cell {
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.message-cell:hover {
  background-color: #f5f5f5;
}
</style>