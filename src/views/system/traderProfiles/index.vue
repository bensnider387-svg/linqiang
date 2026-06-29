<template>
  <lay-container fluid="true" class="trader-profiles-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="搜索" label-width="40">
              <lay-input
                v-model="searchQuery.search"
                placeholder="请输入用户名/简介搜索"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="状态" label-width="40">
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
      
        <template #status="{ row }">
          <lay-switch
            :model-value="row.status === true || row.status === 'active'"
            @change="changeStatus($event, row)"
          ></lay-switch>
        </template>
        <template #avatar="{ row }">
          <lay-avatar :src="row.profile_image_url || row.avatar"></lay-avatar>
        </template>
        <template v-slot:toolbar v-if="!userStore.userInfo.trader_uuid">
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')" >
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
            content="确定要删除此交易者档案吗?"
            @confirm="confirmDelete(row.id)"
            @cancel="cancelDelete"
          >
            <lay-button size="xs" border="red" border-style="dashed" v-if="!userStore.userInfo.trader_uuid"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['900px', '710px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required @submit.prevent>
          <lay-form-item label="交易员名称" prop="trader_name" :label-width="200">
            <lay-input v-model="model11.trader_name" placeholder="请输入用户名"></lay-input>
          </lay-form-item>
          <lay-form-item label="专业头衔" prop="professional_title" :label-width="200">
            <lay-input v-model="model11.professional_title" placeholder="请输入专业头衔"></lay-input>
          </lay-form-item>
          <lay-form-item label="经验年限" prop="years_of_experience" :label-width="200" mode="inline">
            <lay-input type="number" v-model="model11.years_of_experience" placeholder="请输入经验年限"></lay-input>
          </lay-form-item>
          <lay-form-item label="总交易次数" prop="total_trades" :label-width="200" mode="inline">
            <lay-input type="number" v-model="model11.total_trades" placeholder="请输入总交易次数"></lay-input>
          </lay-form-item>
          <lay-form-item label="胜率" prop="win_rate" :label-width="200" mode="inline">
            <lay-input type="number" v-model="model11.win_rate" placeholder="请输入胜率"></lay-input>
          </lay-form-item>
            <lay-form-item label="成员数量" prop="members_count" :label-width="200" mode="inline">
            <lay-input type="number" v-model="model11.members_count" placeholder="请输入成员数量"></lay-input>
          </lay-form-item>
          <lay-form-item label="点赞数量" prop="likes_count" :label-width="200" mode="inline">
            <lay-input type="number" v-model="model11.likes_count" placeholder="请输入点赞数量"></lay-input>
          </lay-form-item>
          <lay-form-item label="状态" prop="status" :label-width="200" mode="inline">
            <lay-select v-model="model11.status" style="width: 100%">
              <lay-select-option value="active" label="启用"></lay-select-option>
              <lay-select-option value="inactive" label="禁用"></lay-select-option>
            </lay-select>
          </lay-form-item>
           <lay-form-item label="头像" prop="likes_count" :label-width="200" mode="inline" :inlineWidth="400">
            <lay-input  v-model="model11.profile_image_url" placeholder="用户头像" :readonly="true"></lay-input>
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
         
          
          <lay-form-item label="会员协议文件" prop="agreement_file" :label-width="200" mode="inline" :inlineWidth="400">
            <lay-input v-model="model11.agreement" placeholder="会员协议文件URL" :readonly="true"></lay-input>
          </lay-form-item>
          
            <lay-upload
              :beforeUpload="beforeUpload10"
              :url="uploaddocumentsUrl"
              v-model="agreementFile"
              field="file"
              :auto="true"
              @done="handleAgreementUploadSuccess"
            mode="inline"
            />
            
          
          <lay-form-item label="网站标题" prop="website_title" :label-width="200">
            <lay-input v-model="model11.website_title" placeholder="请输入网站标题"></lay-input>
          </lay-form-item>
          <lay-form-item label="首页顶部标题" prop="home_top_title" :label-width="200">
            <lay-input v-model="model11.home_top_title" placeholder="请输入首页顶部标题"></lay-input>
          </lay-form-item>
          <lay-form-item label="首页顶部标题链接" prop="home_top_title_link" :label-width="200">
            <lay-input v-model="model11.home_top_title_link" placeholder="请输入跳转链接，如：https://www.baidu.com"></lay-input>
          </lay-form-item>
          <lay-form-item label="支付二维码图片" prop="pay_qr_code_img" :label-width="200" mode="inline" :inlineWidth="400">
            <lay-input v-model="model11.pay_qr_code_img" placeholder="支付二维码图片URL" :readonly="true"></lay-input>
          </lay-form-item>
          
            <lay-upload
              :beforeUpload="beforeUpload10"
              :url="uploadImageUrl"
              v-model="payQrCodeFile"
              field="file"
              :auto="true"
              @done="handlePayQrCodeUploadSuccess"
            mode="inline"
            />
            <lay-form-item label="钱包地址" prop="paycode" :label-width="200">
            <lay-input v-model="model11.paycode" placeholder="请输入钱包地址"></lay-input>
          </lay-form-item>
          <lay-form-item label="会员协议" prop="terms" :label-width="200">
            <lay-textarea v-model="model11.terms" placeholder="请输入会员协议"></lay-textarea>
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
import { getTraderProfiles, createTraderProfile, updateTraderProfile, deleteTraderProfile } from '../../../api/module/traderProfiles'
import { useUserStore } from '@/store'
import { formatDatesForDisplay } from '@/utils/dateFormat'
// 定义交易者档案接口
interface TraderProfile {
  id: string;
  trader_name: string;
  professional_title?: string;
  profile_image_url?: string;
  years_of_experience?: number;
  total_trades?: number;
  win_rate?: number;
  website_title?: string;
  home_top_title?: string;
  agreement?: string;
  members_count: number;
  likes_count: number;
  pay_qr_code_img?: string;
}
const uploadImageUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/images":"https://houduan-api.onrender.com/api/upload/images"
const uploaddocumentsUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/documents":"https://houduan-api.onrender.com/api/upload/documents"


// 表格列配置
const columns = ref([
 
  { key: 'trader_uuid', title: 'Trader UUID', width: 300 },
   { title: '头像', width: '50px', key: 'profile_image_url', customSlot: 'avatar' },
  { key: 'trader_name', title: '用户名', width: 120 },
  { key: 'professional_title', title: '专业头衔', width: 150 },
  { key: 'years_of_experience', title: '经验年限', width: 100 },
  { key: 'total_trades', title: '总交易次数', width: 120 },
  { key: 'win_rate', title: '胜率(%)', width: 100 },
  { key: 'members_count', title: '成员数量', width: 100, sort: true },
  { key: 'likes_count', title: '点赞数量', width: 100, sort: true },
  { key: 'status', title: '状态', width: 80, slotName: 'status' },
  { key: 'created_at', title: '创建时间', width: 150 },
  { key: 'updated_at', title: '更新时间', width: 150 },
  { key: 'operator', title: '操作', width: 120, customSlot: 'operator',  fixed: 'right' }
])
const userStore = useUserStore()
// 搜索条件
const searchQuery = ref({
  search: '',
  status: ''
})

// 分页配置
const page = ref({
  current: 1,
  limit: 10,
  total: 0
})

// 数据源
const dataSource = ref<TraderProfile[]>([])

// 加载状态
const loading = ref(false)

// 选中的行
const selectedKeys = ref<string[]>([])

// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
const visibleImport = ref(false)
const file1 = ref<any[]>([])
const avatarFile = ref<any[]>([])
const agreementFile = ref<any[]>([])
const payQrCodeFile = ref<any[]>([])
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
    search: '',
    status: ''
  }
  page.value.current = 1
  change(page)
}

// 搜索
function toSearch() {
  page.value.current = 1
  change(page)
}

// 分页改变时加载数据
const change = async (page: any) => {
  // 使用传入的page对象更新当前分页信息
  if (page) {
    page.value.current = page.value.current || 1;
    page.value.limit = page.value.limit || 10;
  }

  loading.value = true
    try {
      // 构建请求参数，确保与后端接口匹配
      const params = {
        limit: page.value.limit,
        offset: (page.value.current - 1) * page.value.limit,
        search: searchQuery.value.search,
        status: searchQuery.value.status
      }
      
      // 调用API获取交易者档案列表
      const response = await getTraderProfiles(params)
      console.log('Trader Profiles Response:', response);
      
      // 确保response数据格式正确
      if (response.success) {
        // 更新数据源
        if (Array.isArray(response.data)) {
          dataSource.value = (response.data || []).map((item: any) => formatDatesForDisplay(item, ['created_at', 'updated_at']))
          page.value.total = response.data.length || 0
        } else if (response.data && Array.isArray(response.data.items)) {
          dataSource.value = (response.data.items || []).map((item: any) => formatDatesForDisplay(item, ['created_at', 'updated_at']))
          page.value.total = response.data.total || 0
        } else if (response.data) {
          dataSource.value = Array.isArray(response.data)
            ? response.data.map((item: any) => formatDatesForDisplay(item, ['created_at', 'updated_at']))
            : [formatDatesForDisplay(response.data, ['created_at', 'updated_at'])]
          page.value.total = response.total || 0
        } else {
          console.error('Invalid response format:', response);
          dataSource.value = []
          page.value.total = 0
        }
      } else {
        layer.msg('获取数据失败', { icon: 2 })
      }
       console.log(page)
    } catch (error) {
    console.error('获取交易者档案列表异常:', error)
    layer.msg('获取数据异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
function sortChange(sortObj: any) {
  // 这里可以根据需要处理排序逻辑
  console.log('sortChange', sortObj)
  change(page)
}

// 批量删除
async function toRemove() {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择要删除的交易者档案', { icon: 3 })
    return
  }
  
  layer.confirm('确定要删除选中的' + selectedKeys.value.length + '个交易者档案吗？', {
    icon: 3,
    title: '确认删除'
  }, async (index: number) => {
   
    try {
      // 遍历删除选中的交易者档案
      for (const id of selectedKeys.value) {
        await deleteTraderProfile(id)
      }
      layer.msg('删除成功', { icon: 1 })
      loading.value = true
      // 刷新数据
      change(page)
      // 清空选中
      selectedKeys.value = []
    } catch (error) {
      console.error('批量删除异常:', error)
      layer.msg('删除异常', { icon: 2 })
    } finally {
      loading.value = false
      layer.close(index)
    }
  })
}

// 确认删除单个
async function confirmDelete(id: string) {
 
  try {
    await deleteTraderProfile(id)
    layer.msg('删除成功', { icon: 1 })
    loading.value = true
    // 刷新数据
    change(page)
  } catch (error) {
    console.error('删除异常:', error)
    layer.msg('删除异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancelDelete() {
  layer.msg('您已取消操作', { icon: 1 })
}

// 修改状态
async function changeStatus(value: boolean, row: any) {
  const statusStr = value ? 'active' : 'inactive'
  loading.value = true
  try {
    const { code, msg } = await updateTraderProfile(row.id, { status: statusStr })
    loading.value = false
    if (code === 200 || code === true) {
      layer.msg(msg || '更新成功', { icon: 1 })
      // 刷新数据
      change(page)
    } else {
      layer.msg(msg || '更新失败', { icon: 2 })
    }
  } catch (error) {
    console.error('修改状态异常:', error)
    layer.msg('操作异常', { icon: 2 })
    loading.value = false
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: TraderProfile) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      trader_uuid: '',
      trader_name: '',
      professional_title: '',
      profile_image_url: '',
      years_of_experience: null,
      total_trades: 0,
      win_rate: null,
      website_title: '',
      home_top_title: '',
      home_top_title_link: '',
      use_dialog: 1,
      allow_close_dialog: 0,
      agreement: '',
      members_count: 0,
      likes_count: 0,
      status: 'active',
      remark: '',
      terms: '',
      pay_qr_code_img: '',
      paycode: ''
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
      if (!model11.value.trader_name) {
        layer.msg('Trader UUID和用户名不能为空', { icon: 3 });
        isSaving.value = false;
        return;
      }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = { ...model11.value };
    
    // 确保状态值格式正确
    if (typeof submitData.status === 'boolean') {
      submitData.status = submitData.status ? 'active' : 'inactive';
    }
    
    // 如果是编辑模式
    if (model11.value.id) {
      // 编辑交易者档案
      const response= await updateTraderProfile(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增交易者档案
      const response = await createTraderProfile(submitData);
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

// 处理上传成功后的回调
function handleUploadSuccess(response: any) {
  uploading.value = false;
  let updataData=JSON.parse(response.data)
  layer.closeAll('loading'); // 关闭上传提示
  if (updataData.success) {
    
    // 将上传成功后的图片URL赋值给profile_image_url字段
    model11.value.profile_image_url = updataData.data.url; // 假设返回的数据直接是图片URL
    console.log(model11.value.profile_image_url)
    layer.msg('上传成功', { icon: 1 });
  } else {
    layer.msg('上传失败', { icon: 2 });
  }
}

// 处理协议上传成功后的回调
function handleAgreementUploadSuccess(response: any) {
  uploading.value = false;
  let updataData=JSON.parse(response.data)
  layer.closeAll('loading'); // 关闭上传提示
  if (updataData.success) {
    
    // 将上传成功后的协议文件URL赋值给agreement_file字段
    model11.value.agreement = updataData.data.url; // 假设返回的数据直接是文件URL
    console.log(model11.value.agreement)
    layer.msg('协议上传成功', { icon: 1 });
  } else {
    layer.msg('协议上传失败', { icon: 2 });
  }
}

// 处理支付二维码上传成功后的回调
function handlePayQrCodeUploadSuccess(response: any) {
  uploading.value = false;
  let updataData=JSON.parse(response.data)
  layer.closeAll('loading'); // 关闭上传提示
  if (updataData.success) {
    
    // 将上传成功后的支付二维码图片URL赋值给pay_qr_code_img字段
    model11.value.pay_qr_code_img = updataData.data.url; // 假设返回的数据直接是图片URL
    console.log(model11.value.pay_qr_code_img)
    layer.msg('支付二维码上传成功', { icon: 1 });
  } else {
    layer.msg('支付二维码上传失败', { icon: 2 });
  }
}

// 上传前校验
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
.trader-profiles-box {
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