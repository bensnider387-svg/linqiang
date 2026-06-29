<template>
  <lay-container fluid="true" class="usersview-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="用户名" label-width="80">
              <lay-input
                v-model="searchQuery.username"
                placeholder="请输入用户名"
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
    <!-- 表格 -->
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
        style="width: 100%"
      >
        
        <template #avatar="{ row }">
          <lay-avatar :src="row.avatar_url || row.avatar"></lay-avatar>
        </template>
      </lay-table>
    </div>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { getUsersView } from '../../api/module/usersView'

// 定义用户接口
interface User {
  id: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  status: string | boolean;
  role: string;
  email_verified?: boolean;
  phone_verified?: boolean;
  two_factor_enabled?: boolean;
  settings?: any;
  trader_uuid?: string;
  realname?: string;
  phonenumber?: string;
  last_login_ip?: string;
  last_login_location?: string;
  membership_level?: string;
  total_asset?: number;
  total_profit?: number;
  monthly_profit?: number;
  closed_profit?: number;
  holding_profit?: number;
  initial_asset?: number;
  created_at: string;
  updated_at?: string;
  last_login?: string;
  prev_month_profit?: number;
  current_month_profit?: number;
}

// 搜索条件
const searchQuery = ref({
  username: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<User[]>([])

// 表格列配置
const columns = ref([
  { title: '头像', width: '50px', key: 'avatar_url', customSlot: 'avatar' },
  { title: '用户名', width: '100px', key: 'username' },
  { title: '真实姓名', width: '100px', key: 'realname' },
  { title: '邮箱', width: '100px', key: 'email' },
  { title: '手机号码', width: '120px', key: 'phonenumber' },
  { title: '角色', width: '80px', key: 'role' },
  { title: '初始资产', width: '100px', key: 'initial_asset' },
  { title: '总获利', width: '150px', key: 'utotle_profit' },
  { title: '持仓利润', width: '150px', key: 'holding_profit' },
  { title: '上月获利', width: '150px', key: 'uprvmonth_profit' },
  { title: '本月获利', width: '100px', key: 'umonth_profit' }
])

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    username: ''
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
      search: searchQuery.value.username,
      name: searchQuery.value.username
    }
    
    // 调用API获取用户列表
    const { data, success, total } = await getUsersView(params)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((user: any) => ({
        ...user,
        // 确保获利相关字段名称正确
        prev_month_profit: user.prev_month_profit || user.monthly_profit,
        current_month_profit: user.current_month_profit || 0
      }))
      
      // 处理分页逻辑
      page.total = total || 0;
    } else {
      layer.msg('获取用户列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取用户列表异常:', error)
    layer.msg('获取用户列表异常', { icon: 2 })
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
</script>

<style scoped>
.usersview-box {
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