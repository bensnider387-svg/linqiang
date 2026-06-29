<template>
  <lay-container fluid="true" class="invitation-code-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="邀请码" label-width="80">
              <lay-input
                v-model="searchQuery.keyword"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="邀请码状态" label-width="100">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.isuse"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="false" label="未使用"></lay-select-option>
                <lay-select-option value="true" label="已使用"></lay-select-option>
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
          <lay-button size="sm" type="primary" @click="toSubmit">
            <lay-icon class="layui-icon-addition"></lay-icon>新增邀请码
            </lay-button
          >
        
        </template>
        <template v-slot:status="{ row }">
          <lay-switch v-model="row.isuse"  trueValue="true" falseValue="false"></lay-switch>
        </template>
        <template v-slot:operator="{ row }">
        
          <lay-popconfirm
            content="确定要删除此邀请码吗?"
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

    <lay-layer v-model="visible" :title="title" :area="['500px', '350px']">
      <div style="padding: 20px">
        <lay-form :model="model" ref="layFormRef" required>
          <lay-form-item label="邀请码" prop="code">
            <lay-input v-model="model.code" placeholder="请输入邀请码"></lay-input>
          </lay-form-item>
          <lay-form-item label="生成数量" prop="count" v-if="!model.id">
            <lay-input v-model="model.count" type="number" min="1" max="100" placeholder="请输入生成数量，默认为1"></lay-input>
          </lay-form-item>
        
        </lay-form>
        <div style="width: 100%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit" :disabled="isSaving">
            <template v-if="!isSaving">保存</template>
            <template v-else>正在保存...</template>
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
import { 
  getInvitationCodeList, 
  createInvitationCode, 
  updateInvitationCode, 
  deleteInvitationCode, 
  batchDeleteInvitationCode,
  InvitationCode
} from '../../../api/module/invitationCode'

// 搜索条件
const searchQuery = ref({
  keyword: '',
  isuse: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<InvitationCode[]>([])

// 表格列配置
const columns = ref([
  
  { title: 'ID', width: '80px', key: 'id' },
  { title: '邀请码', width: '180px', key: 'code', sort: 'desc' },
  { title: '状态', width: '100px', key: 'isuse', customSlot: 'status' },
  { title: '创建者', width: '120px', key: 'create_user_id' },
  { title: '创建时间', width: '180px', key: 'create_time' },
  { title: '使用用户', width: '120px', key: 'username' },
  { title: '使用时间', width: '180px', key: 'used_time' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model = ref<any>({
  id: 0,
  code: '',
  isuse: false,
  username: '',
  count: 1
})
const layFormRef = ref()
const visible = ref(false)
const title = ref('新增邀请码')

// 保存状态
const isSaving = ref(false)

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    keyword: '',
    isuse: ''
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
    page.current = page.current || 1
    page.limit = page.limit || 10
  }

  loading.value = true
  try {
    // 构建请求参数
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.keyword,
      isuse: searchQuery.value.isuse
    }
    
    // 调用API获取邀请码列表
    const response = await getInvitationCodeList(params)
    
    if (response.success) {
      // 转换数据格式以适应表格
      dataSource.value = response.data || []
      
      // 处理分页逻辑
      page.total = response.total || 0
    } else {
      layer.msg('获取邀请码列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取邀请码列表异常:', error)
    layer.msg('获取邀请码列表异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}

// 修改邀请码状态
const changeStatus = async (isChecked: boolean, row: InvitationCode) => {
  try {
    const response = await updateInvitationCode(row.id, { isuse: isChecked })
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
      // 更新本地数据
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].isuse = isChecked
      }
    } else {
      layer.msg(response.message || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].isuse = row.isuse
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].isuse = row.isuse
    }
  }
}



// 打开新增/编辑对话框
const changeVisible = (text: string, row?: InvitationCode) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model.value = { ...row }
  } else {
    // 新增模式，清空表单
    model.value = {
      id: 0,
      code: '',
      isuse: false,
      username: '',
      count: 1
    }
  }
  visible.value = true
}
async function copyText(text:any) {
      try {
        await navigator.clipboard.writeText(text);
        alert('文本已复制到剪贴板');
      } catch (err) {
        console.error('复制失败', err);
      }
    }
// 提交表单
async function toSubmit() {
  // 防止重复提交
  if (isSaving.value) {
    return;
  }
  
  try {
    // 设置保存状态
    isSaving.value = true;
    
    layer.load(0, {time: 3000})
    const response = await createInvitationCode()
    if (response.success) {
      layer.closeAll()
      layer.confirm(response.message)
      visible.value = false
      // 刷新数据
      change(page)
    } else {
      layer.msg(response.message || '新增失败', { icon: 2 })
    }
  } catch (error) {
    console.error('提交表单异常', error)
    layer.msg('操作异常', { icon: 2 })
  } finally {
    // 重置保存状态
    isSaving.value = false;
  }
}

// 关闭对话框
function toCancel() {
  visible.value = false
}

// 确认删除单个邀请码
async function confirm(data: InvitationCode) {
  
  try {
    const response = await deleteInvitationCode(data.id)
    if (response.success) {
      layer.msg('删除成功', { icon: 1 })
      loading.value = true
      // 刷新数据
      change(page)
      // 清空选择
      selectedKeys.value = []
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 })
    }
  } catch (error) {
    console.error('删除邀请码异常:', error)
    layer.msg('删除邀请码异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}
</script>

<style scoped>
.invitation-code-box {
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
</style>