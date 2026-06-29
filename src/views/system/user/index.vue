<template>
  <lay-container fluid="true" class="user-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="用户账号" label-width="80">
              <lay-input
                v-model="searchQuery.userAccount"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="用户名" label-width="80">
              <lay-input
                v-model="searchQuery.userName"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="角色" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.role"
                :allow-clear="true"
                placeholder="请选择"
              >
               <lay-select-option value="superadmin" label="超级管理员" v-if="!model11.trader_uuid"></lay-select-option>
                <lay-select-option value="admin" label="管理员"></lay-select-option>
                <lay-select-option value="user" label="普通用户"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.status"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="active" label="启用"></lay-select-option>
                <lay-select-option value="inactive" label="禁用"></lay-select-option>
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
       
        <template #avatar="{ row }">
          <lay-avatar :src="row.avatar_url || row.avatar"></lay-avatar>
        </template>
         <template #signing="{ row }">
           <lay-tag type="primary" v-if="row.signing">已签署</lay-tag>
           <lay-tag type="danger" v-else>未签署</lay-tag>
         </template>
         <template #vipStatus="{ row }">
           <lay-tag type="primary" v-if="row.is_vip">VIP</lay-tag>
           <lay-tag type="default" v-else>普通</lay-tag>
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
            content="确定要删除此用户吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['600px', '880px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" labelWidth="120px" required>
          <lay-form-item label="用户名" prop="username">
            <lay-input v-model="model11.username"></lay-input>
          </lay-form-item>
           
          <lay-form-item label="密码" prop="password_hash">
            <lay-input type="password" v-model="model11.password_hash" placeholder="新增用户必填，编辑用户为空则不修改密码"></lay-input>
          </lay-form-item>
           <lay-form-item label="头像" prop="username" mode="inline" :inlineWidth="200">
            <lay-input v-model="model11.avatar_url" placeholder="用户头像" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUpload10"
            :url="uploadImageUrl"
            v-model="avatarFile"
            field="file"
            :auto="true"
            @done="handleUploadSuccess"
            mode="inline"
          />
         
          <lay-form-item label="邮箱" prop="email">
            <lay-input v-model="model11.email"></lay-input>
          </lay-form-item>
          <lay-form-item label="真实姓名" prop="realname">
            <lay-input v-model="model11.realname" placeholder="请输入真实姓名"></lay-input>
          </lay-form-item>
          <lay-form-item label="手机号码" prop="phonenumber">
            <lay-input v-model="model11.phonenumber" placeholder="请输入手机号码"></lay-input>
          </lay-form-item>
          <lay-form-item label="角色" prop="role">
            <lay-select v-model="model11.role" style="width: 100%">
               <lay-select-option value="superadmin" label="超级管理员" v-if="!model11.trader_uuid"></lay-select-option>
              <lay-select-option value="user" label="普通用户"></lay-select-option>
              <lay-select-option value="admin" label="管理员"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="状态" prop="status">
            <lay-select v-model="model11.status" style="width: 100%">
              <lay-select-option value="active" label="启用"></lay-select-option>
              <lay-select-option value="inactive" label="禁用"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="会员等级" prop="membership_level">
            <lay-select v-model="model11.membership_level" style="width: 100%">
              <lay-select-option value="" label="无等级"></lay-select-option>
              <lay-select-option v-for="level in membershipLevels" :key="level.id" :value="level.name" :label="level.name"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="初始资产" prop="initial_asset">
            <lay-input v-model="model11.initial_asset" type="number" placeholder="请输入初始资产金额"></lay-input>
          </lay-form-item>
          <lay-form-item label="会员积分" prop="membership_points">
            <lay-input v-model="model11.membership_points" type="number" placeholder="请输入会员积分"></lay-input>
          </lay-form-item>
           <lay-form-item label="交易员UUID" prop="initial_asset">
            <lay-input v-model="model11.trader_uuid" placeholder="请输入交易员UUID"></lay-input>
          </lay-form-item>
           <lay-form-item label="协议签署" prop="signing">
            <lay-switch v-model="model11.signing" onswitch-text="已签署"  unswitch-text="未签署"></lay-switch>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit"
            >保存</lay-button
          >
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
    <lay-layer
      v-model="visibleImport"
      title="导入用户"
      :area="['380px', '380px']"
    >
      <lay-upload
        :beforeUpload="beforeUpload10"
        style="margin: 60px"
        url="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        v-model="file1"
        field="file"
        :auto="false"
        :drag="true"
      >
        <template #preview>
          {{ file1[0]?.name }}
        </template>
      </lay-upload>
      <div style="width: 100%; text-align: center">
        只能上传小于1000KB的文件
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { getUsers, createUser, updateUser, deleteUser } from '../../../api/module/user'
import { getMembershipLevels as apiGetMembershipLevels } from '../../../api/module/membershipLevels'
import { useUserStore } from '@/store';
import { formatDatesForDisplay } from '@/utils/dateFormat';
const uploadImageUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/images":"https://houduan-api.onrender.com/api/upload/images"
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
  is_vip?: boolean;
  vip_expire_at?: string;
  // 前端展示用字段
  name?: string;
  avatar?: string;
  sex?: string;
  city?: string;
  age?: string;
  remark?: string;
}
const trader_uuid=ref('');
// 搜索条件
const searchQuery = ref({
  userAccount: '',
  userName: '',
  role: '',
  status: ''
})

// 导入相关
const visibleImport = ref(false)
const file1 = ref<any>([])

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<User[]>([])

// 表格列配置
const columns = ref([
 
  { title: '头像', width: '50px', key: 'avatar_url', customSlot: 'avatar' },
  { title: '用户名', width: '100px', key: 'username', sort: 'desc' },
  { title: '真实姓名', width: '100px', key: 'realname' },
  { title: '手机号码', width: '120px', key: 'phonenumber' },
  { title: '角色', width: '80px', key: 'role' },
  { title: '状态', width: '80px', key: 'status'},
  { title: '邮箱', width: '150px', key: 'email' },
  { title: '会员等级', width: '100px', key: 'membership_level' },
  { title: 'VIP状态', width: '80px', key: 'is_vip', customSlot: 'vipStatus' },
  { title: 'VIP过期时间', width: '150px', key: 'vip_expire_at' },
  { title: '签署协议', width: '150px', key: 'signing', customSlot: 'signing'},
   { title: '会员积分', width: '100px', key: 'membership_points' },
  { title: '初始资产', width: '100px', key: 'initial_asset' },
  { title: '注册时间', width: '150px', key: 'created_at' },
  { title: '最后登录', width: '150px', key: 'last_login' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])



// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
// 头像上传相关
const avatarFile = ref<any>([])
const uploading = ref(false)
// 会员等级列表
const membershipLevels = ref<any[]>([])

// 初始化加载数据
onMounted(() => {
  model11.trader_uuid=useUserStore().userInfo.trader_uuid;
  change(page)
  getMembershipLevels()
})

// 获取会员等级列表
async function getMembershipLevels() {
  try {
    // 使用API模块中的getMembershipLevels函数
    const response = await apiGetMembershipLevels()
  
    if (response.success) {
      // 根据后端API返回格式调整，实际会员等级数据在response.data.data中
      if (response.data) {
        membershipLevels.value = response.data
      } else {
        membershipLevels.value = []
      }
      
    } else {
      layer.msg('获取会员等级失败', { icon: 2 })
    }
  } catch (error) {
  
    layer.msg('获取会员等级异常', { icon: 2 })
  }
}

// 打开导入对话框
function toImport() {
  visibleImport.value = true
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    userAccount: '',
    userName: '',
    role: '',
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
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.userAccount, // 后端使用search参数搜索用户名
      name: searchQuery.value.userName,
      role: searchQuery.value.role,
      status: searchQuery.value.status
    }
    
    // 调用API获取用户列表
    const { data, success, total } = await getUsers(params)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((item: any) => {
        const row = formatDatesForDisplay({ ...item }, ['created_at'])
        row.joinTime = row.created_at
        return row
      })
      
      // 处理分页逻辑 - 后端现在已返回total字段，直接使用
      page.total = total || 0;

    } else {
      layer.msg('获取用户列表失败', { icon: 2 })
    }
   
  } catch (error) {
   
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

// 修改用户状态
const changeStatus = async (isChecked: boolean, row: User) => {
  loading.value = true
  try {
    // 根据isChecked布尔值转换为后端需要的状态字符串
    const statusStr = isChecked ? 'active' : 'inactive';
    const { code, msg } = await updateUser(row.id, { status: statusStr })
    if (code === 200) {
      layer.msg('状态更新成功', { icon: 1 })
      // 更新本地数据
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].status = isChecked
      }
    } else {
      layer.msg(msg || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].status = !isChecked
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].status = !isChecked
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
         
          try {
            // 批量删除用户（这里假设后端支持批量删除，否则可以循环调用deleteUser）
            for (const userId of selectedKeys.value) {
              await deleteUser(userId)
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除用户异常:', error)
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
const changeVisible11 = (text: string, row?: User) => {
  title.value = text
  console.log(row)
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }

  } else {
    console.log(useUserStore().userInfo)
    // 新增模式，清空表单
    model11.value = {
          username: '',
          password_hash: '', // 后端需要password_hash而不是password
          email: '',
          role: 'user',
          status: 'active',
          membership_level: 0,
          remark: '',
          email_verified: false,
          phone_verified: false,
          two_factor_enabled: false,
          realname: '',
          phonenumber: '',
          initial_asset: '',
          membership_points: 0,
          signing: false
        }
      model11.value.trader_uuid=useUserStore().userInfo.trader_uuid;
  }
  visible11.value = true

}

// 提交表单
    async function toSubmit() {
      
      try {
        // 表单验证
        if (!model11.value.username) {
          layer.msg('用户名不能为空', { icon: 3 });
          loading.value = false;
          return;
        }
        
        // 创建提交数据对象，确保与后端接口匹配
        const submitData = { ...model11.value };
        
        // 如果存在password字段但不存在password_hash，将password重命名为password_hash
        if (submitData.password && !submitData.password_hash) {
          submitData.password_hash = submitData.password;
          delete submitData.password;
        }
        
        // 确保状态值格式正确
        if (typeof submitData.status === 'boolean') {
          submitData.status = submitData.status ? 'active' : 'inactive';
        }
        
        // 如果是新增用户，确保必填字段存在
        if (!model11.value.id && !submitData.password_hash) {
          layer.msg('新增用户必须设置密码', { icon: 3 });
          loading.value = false;
          return;
        }
        
        if (model11.value.id) {
          // 编辑用户
          // 如果密码为空，则不修改密码
          if (!submitData.password_hash) {
            delete submitData.password_hash;
          }
          const response = await updateUser(model11.value.id, submitData);
          loading.value = false;
          if (response.success) {
            layer.msg(response.message || '更新成功', { icon: 1 });
            visible11.value = false;
           
            // 刷新数据
            change(page);
          } else {
            layer.msg(response.message || '更新失败', { icon: 2 });
          }
        } else {
          // 新增用户
          // 添加必要的默认字段
          submitData.email_verified = false;
          submitData.phone_verified = false;
          submitData.two_factor_enabled = false;
          
          const response = await createUser(submitData);
          loading.value = false;
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
        loading.value = false;
      }
    }

// 关闭对话框
function toCancel() {
  visible11.value = false
}

// 处理上传成功后的回调
function handleUploadSuccess(response: any) {
  uploading.value = false;
  let updataData=JSON.parse(response.data)
  layer.closeAll('loading'); // 关闭上传提示
  if (updataData.success) {
    
    // 将上传成功后的图片URL赋值给avatar_url字段
    model11.value.avatar_url = updataData.data.url; // 假设返回的数据直接是图片URL
    console.log(model11.value.avatar_url)
    layer.msg('上传成功', { icon: 1 });
  } else {
    layer.msg('上传失败', { icon: 2 });
  }
}

// 确认删除单个用户
async function confirm(data:any) {
  // 这个方法应该是单个删除的确认，在实际项目中可以根据需要实现
   try {
            // 批量删除用户（这里假设后端支持批量删除，否则可以循环调用deleteUser）
           
          const  Response=  await deleteUser(data.id)
            if(Response.success)
            {
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
            }
            else
            {
              layer.msg('删除失败', { icon: 2 })
            }
          } catch (error) {
            console.error('删除用户异常:', error)
            layer.msg('删除失败', { icon: 2 })
          } finally {
            loading.value = false
            layer.close(id)
          }
  layer.msg('您已成功删除')
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}
const beforeUpload10 = (file: File) => {
  var isOver = false
  if (file.size > 5 * 1024 * 1024) {
    isOver = true
    layer.msg(`file size over 5MB`, { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }
  // 设置上传中状态
  uploading.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}
</script>

<style scoped>
.user-box {
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