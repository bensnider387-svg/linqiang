<template>
  <lay-container fluid="true" class="announcement-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="公告标题" label-width="80">
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
            <lay-form-item label="状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.active"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="true" label="启用"></lay-select-option>
                <lay-select-option value="false" label="禁用"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="优先级" label-width="80">
              <lay-input
                v-model="searchQuery.priority"
                placeholder="请输入"
                size="sm"
                type="number"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
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
        <template #active="{ row }">
          <lay-switch
            :model-value="row.active === true || row.active === 'true'"
            @change="changeStatus($event, row,'active')"
          ></lay-switch>
        </template>
          <template #popup_enabled="{ row }">
          <lay-switch
            :model-value="row.popup_enabled === true || row.popup_enabled === 'true'"
            @change="changeStatus($event, row,'popup_enabled')"
          ></lay-switch>
        </template>
         <template #show_to_members="{ row }">
          <lay-switch
            :model-value="row.show_to_members === true || row.show_to_members === 'true'"
            @change="changeStatus($event, row,'show_to_members')"
          ></lay-switch>
        </template>
         <template #allow_close_dialog="{ row }">
          <lay-switch
            :model-value="row.allow_close_dialog === 1 || row.allow_close_dialog === '1'"
            @change="changeStatus($event, row,'allow_close_dialog')"
          ></lay-switch>
        </template>
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
            content="确定要删除此公告吗?"
            @confirm="confirmDelete(row.id)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['900px', '630px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
          <lay-form-item label="公告标题" prop="title" :label-width="160">
            <lay-input v-model="model11.title"></lay-input>
          </lay-form-item>
          <lay-form-item label="公告内容" prop="content">
            <lay-textarea v-model="model11.content" :rows="10"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="状态" prop="active" mode="inline" :label-width="160">
         
           <lay-switch v-model="model11.active" :onswitch-value="true" :unswitch-value="false"></lay-switch>
          </lay-form-item>
          <lay-form-item label="优先级" prop="priority" mode="inline" :label-width="160">
            <lay-input v-model="model11.priority" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="弹窗启用" prop="popup_enabled" mode="inline" :label-width="160">
          
           <lay-switch v-model="model11.popup_enabled" :onswitch-value="true" :unswitch-value="false"></lay-switch>
          </lay-form-item>
          <lay-form-item label="延迟秒数" prop="delay_seconds" mode="inline" :label-width="160">
            <lay-input v-model="model11.delay_seconds" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="显示给会员" prop="show_to_members" mode="inline" :label-width="160">
           
           <lay-switch v-model="model11.show_to_members" :onswitch-value="true" :unswitch-value="false"></lay-switch>
          </lay-form-item>
          <lay-form-item label="允许关闭对话框" prop="allow_close_dialog" mode="inline" :label-width="160">
          
             <lay-switch v-model="model11.allow_close_dialog" :onswitch-value="1" :unswitch-value="0"></lay-switch>
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
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement } from '../../../api/module/announcements'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 定义公告接口
interface Announcement {
  id: string;
  title: string;
  content: string;
  active: boolean | string;
  priority: number;
  trader_uuid: string;
  created_at: string;
  updated_at: string;
  popup_enabled: boolean | string;
  delay_seconds: number;
  show_to_members: boolean | string;
  allow_close_dialog: number;
}

// 搜索条件
const searchQuery = ref({
  title: '',
  active: '',
  priority: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<Announcement[]>([])

// 表格列配置
const columns = ref([
 
  { title: '标题', width: '200px', key: 'title' },
  { title: '优先级', width: '80px', key: 'priority' },
  { title: '状态', width: '80px', key: 'active', customSlot: 'active' },
  { title: '弹窗启用', width: '100px', key: 'popup_enabled' , customSlot: 'popup_enabled'},
  { title: '延迟时间', width: '80px', key: 'delay_seconds' },
  { title: '显示给会员', width: '100px', key: 'show_to_members' , customSlot: 'show_to_members'},
  { title: '允许关闭', width: '100px', key: 'allow_close_dialog' , customSlot: 'allow_close_dialog'},
  { title: '创建时间', width: '150px', key: 'created_at' },
  { title: '更新时间', width: '150px', key: 'updated_at' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({})
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
    active: '',
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
    // 构建请求参数，确保与后端接口匹配
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      query: searchQuery.value.title,
      active: searchQuery.value.active,
      priority: searchQuery.value.priority
    }
    
    // 调用API获取公告列表
    const { data, success, total } = await getAnnouncements(params)
    if (success) {
      dataSource.value = data.map((item: any) => formatDatesForDisplay(item, ['created_at', 'updated_at']))
      page.total = total || 0;
    } else {
      layer.msg('获取公告列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取公告列表异常:', error)
    layer.msg('获取公告列表异常', { icon: 2 })
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
const changeStatus = async (isChecked: boolean, row: Announcement,key: any) => {
 
  try {
    let val
    if(key=='allow_close_dialog'){
      val=isChecked?1:0
    }
    else
    {
      val=isChecked
    }
    let para={}
    para[key]=val
    const response= await updateAnnouncement(row.id, para)
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
    
       loading.value = true
       change(page)
    } else {
      layer.msg(response.message || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].active = !isChecked
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].active = !isChecked
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
              await deleteAnnouncement(announcementId)
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

// 确认删除单个公告
function confirmDelete(id: string) {
 
  try {
    deleteAnnouncement(id).then(() => {
      layer.msg('删除成功', { icon: 1 })
       loading.value = true
      // 刷新数据
      change(page)
    }).catch(() => {
      layer.msg('删除失败', { icon: 2 })
    }).finally(() => {
      loading.value = false
    })
  } catch (error) {
    console.error('删除公告异常:', error)
    layer.msg('删除异常', { icon: 2 })
    loading.value = false
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: Announcement) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      title: '',
      content: '',
      active: true,
      priority: 1,
      popup_enabled: true,
      delay_seconds: 10,
      show_to_members: false,
      allow_close_dialog: 0
    }
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
    // 表单验证
    if (!model11.value.title || !model11.value.content) {
      layer.msg('标题和内容不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = { ...model11.value };
    
    // 转换布尔值
    if (typeof submitData.active === 'string') {
      submitData.active = submitData.active === 'true';
    }
    if (typeof submitData.popup_enabled === 'string') {
      submitData.popup_enabled = submitData.popup_enabled === 'true';
    }
    if (typeof submitData.show_to_members === 'string') {
      submitData.show_to_members = submitData.show_to_members === 'true';
    }
  
    
    
    // 添加当前登录用户的trader_uuid
    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (currentUser.trader_uuid) {
      submitData.trader_uuid = currentUser.trader_uuid;
    }
    
    if (model11.value.id) {
      // 编辑公告
      const response = await updateAnnouncement(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增公告
      const response = await createAnnouncement(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        loading.value = true;
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

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}
</script>

<style scoped>
.announcement-box {
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
</style>