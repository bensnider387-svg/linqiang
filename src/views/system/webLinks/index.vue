<template>
  <lay-container fluid="true" class="weblink-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="网站名称" label-width="80">
              <lay-input
                v-model="searchQuery.webname"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="交易平台" label-width="80">
              <lay-input
                v-model="searchQuery.trader_uuid"
                placeholder="请输入"
                size="sm"
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
        @sort-change="sortChange"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button
          >
        </template>
        <template v-slot:createtime="{ row }">
          <span>{{ formatDate(row.createtime) }}</span>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此网站链接吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['750px', '400px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
          <lay-form-item label="网站名称" prop="webname" :label-width="140">
            <lay-input v-model="model11.webname" placeholder="请输入网站名称"></lay-input>
          </lay-form-item>
          <lay-form-item label="网站链接" prop="link_url" :label-width="140">
            <lay-input v-model="model11.link_url" placeholder="请输入网站链接"></lay-input>
          </lay-form-item>
          <lay-form-item label="交易平台UUID" prop="trader_uuid" :label-width="140" v-if="isSuperAdmin">
            <lay-input v-model="model11.trader_uuid" placeholder="请输入交易平台UUID"></lay-input>
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
import { ref, reactive, onMounted, computed } from 'vue'
import { layer } from '@layui/layui-vue'
import { getWebLinks, createWebLink, updateWebLink, deleteWebLink } from '@/api/module/webLinks'
import { useUserStore } from '@/store/user'
import { formatUSDate } from '@/utils/dateFormat'

// 定义网站链接接口
interface WebLink {
  id: string;
  trader_uuid: string;
  webname: string;
  link_url: string;
  createtime: string;
}

// 搜索条件
const searchQuery = ref({
  webname: '',
  trader_uuid: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<WebLink[]>([])

// 表格列配置
const columns = ref([
  { title: 'ID', width: '180px', key: 'id' },
  { title: '网站名称', width: '200px', key: 'webname', sort: 'desc' },
  { title: '网站链接', width: '300px', key: 'link_url' },
  { title: '交易平台', width: '200px', key: 'trader_uuid' },
  { title: '创建时间', width: '150px', key: 'createtime', customSlot: 'createtime' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: '',
  webname: '',
  link_url: '',
  trader_uuid: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const isSaving = ref(false)

// 用户存储
const userStore = useUserStore()

// 判断是否为超级管理员
const isSuperAdmin = computed(() => {
  return userStore.userInfo?.role === 'superadmin'
})

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    webname: '',
    trader_uuid: ''
  }
  change(page)
}

// 搜索
function toSearch() {
  page.current = 1
  change(page)
}

// 格式化日期
function formatDate(dateString: string) {
  return formatUSDate(dateString)
}

// 获取数据
async function change(currentPage: any) {
  loading.value = true
  try {
    const params = {
      limit: currentPage.limit,
      offset: (currentPage.current - 1) * currentPage.limit,
      search: searchQuery.value.webname,
      trader_uuid: searchQuery.value.trader_uuid
    }
    
    const response = await getWebLinks(params)
    if (response.success) {
      dataSource.value = response.data
      page.total = response.total
    } else {
      layer.msg(response.message || '获取数据失败', { icon: 2 })
    }
  } catch (error) {
    layer.msg('获取数据失败', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
function sortChange(column: any) {
  change(page)
}

// 显示对话框
function changeVisible11(type: string, row?: WebLink) {
  title.value = type
  visible11.value = true
  
  if (type === '编辑' && row) {
    model11.value = {
      id: row.id,
      webname: row.webname,
      link_url: row.link_url,
      trader_uuid: row.trader_uuid
    }
  } else {
    model11.value = {
      id: '',
      webname: '',
      link_url: '',
      trader_uuid: userStore.userInfo?.trader_uuid || ''
    }
  }
}

// 取消
function toCancel() {
  visible11.value = false
  layFormRef11.value.resetFields()
}

// 提交表单
async function toSubmit() {
  try {
    await layFormRef11.value.validate()
    isSaving.value = true
    
    let response: any
    if (title.value === '新增') {
      response = await createWebLink(model11.value)
    } else {
      response = await updateWebLink(model11.value.id, model11.value)
    }
    
    if (response.success) {
      layer.msg(response.message || '保存成功', { icon: 1 })
      visible11.value = false
      change(page)
    } else {
      layer.msg(response.message || '保存失败', { icon: 2 })
    }
  } catch (error) {
    layer.msg('保存失败', { icon: 2 })
  } finally {
    isSaving.value = false
  }
}

// 删除确认
async function confirm(row: WebLink) {
  try {
    const response = await deleteWebLink(row.id)
    if (response.success) {
      layer.msg('删除成功', { icon: 1 })
      change(page)
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 })
    }
  } catch (error) {
    layer.msg('删除失败', { icon: 2 })
  }
}

// 取消删除
function cancel() {
  // 取消删除操作
}
</script>

<style scoped>
.weblink-box {
  padding: 10px;
  background-color: var(--global-bg-color);
  box-sizing: border-box;
  height: 100%;
}

.table-box {
  margin-top: 10px;
  background-color: #fff;
  height: calc(100% - 120px);
  padding: 10px;
  box-sizing: border-box;
}
</style>