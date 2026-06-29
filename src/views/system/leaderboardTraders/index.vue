<template>
  <lay-container fluid="true" class="leaderboard-traders-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="交易员名称" label-width="100">
              <lay-input
                v-model="searchQuery.trader_name"
                placeholder="请输入交易员名称"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="专业头衔" label-width="100">
              <lay-input
                v-model="searchQuery.professional_title"
                placeholder="请输入专业头衔"
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
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此交易员排行榜数据吗?"
            @confirm="confirm(row)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
        <template v-slot:avatar="{ row }">
          <div v-if="row.profile_image_url && row.profile_image_url !== ''" @click="viewImage(row.profile_image_url)" style="cursor: pointer;">
            <img :src="row.profile_image_url" alt="交易员头像" style="width: 40px; height: 40px; object-fit: cover; border-radius: 50%;">
          </div>
          <span v-else style="color: #999;">无头像</span>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['750px', '700px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
           <lay-form-item label="交易员名称" prop="trader_name" :label-width="140">
            <lay-input v-model="model11.trader_name" placeholder="请输入交易员名称"></lay-input>
          </lay-form-item>
          <lay-form-item label="专业头衔" prop="professional_title" :label-width="140">
            <lay-input v-model="model11.professional_title" placeholder="请输入专业头衔"></lay-input>
          </lay-form-item>
        
          <lay-form-item label="总利润" prop="total_profit" :label-width="140">
            <lay-input v-model="model11.total_profit" type="number" placeholder="请输入总利润"></lay-input>
          </lay-form-item>
          <lay-form-item label="总交易次数" prop="total_trades" :label-width="140">
            <lay-input v-model="model11.total_trades" type="number" placeholder="请输入总交易次数"></lay-input>
          </lay-form-item>
          <lay-form-item label="胜率" prop="win_rate" :label-width="140">
            <lay-input v-model="model11.win_rate" type="number" placeholder="请输入胜率"></lay-input>
          </lay-form-item>
          <lay-form-item label="月度利润" prop="monthly_profit" :label-width="140">
            <lay-input v-model="model11.monthly_profit" type="number" placeholder="请输入月度利润"></lay-input>
          </lay-form-item>
          <lay-form-item label="关注人数" prop="followers_count" :label-width="140">
            <lay-input v-model="model11.followers_count" type="number" placeholder="请输入关注人数"></lay-input>
          </lay-form-item>
          <lay-form-item label="点赞数" prop="likes_count" :label-width="140">
            <lay-input v-model="model11.likes_count" type="number" placeholder="请输入点赞数"></lay-input>
          </lay-form-item>
          <lay-form-item label="头像图片" prop="profile_image_url" :label-width="140" mode="inline" :inlineWidth="350">
            <lay-input v-model="model11.profile_image_url" placeholder="头像图片URL" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-form-item :label-width="100" mode="inline">
            <lay-upload
              :beforeUpload="beforeUpload10"
              :url="uploadvideosUrl"
              v-model="avatarFile"
              field="file"
              :auto="true"
              @done="handleUploadSuccess"
              mode="inline"
            />
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right">
          <lay-button size="sm" type="primary" @click="toSubmit">保存</lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { getList, create, update, del } from '../../../api/module/leaderboardTraders'
import { formatDatesForDisplay } from '@/utils/dateFormat'
const uploadvideosUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/images":"https://houduan-api.onrender.com/api/upload/images"
// 定义交易员排行榜接口
interface LeaderboardTrader {
  id: number;
  trader_name: string;
  professional_title: string;
  profile_image_url: string;
  total_profit: number;
  total_trades: number;
  win_rate: number;
  followers_count: number;
  likes_count: number;
  created_at: string;
  updated_at: string;
  monthly_profit: number;
  trader_uuid?: string;
}


// 搜索条件
const searchQuery = ref({
  trader_name: '',
  professional_title: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<LeaderboardTrader[]>([])


// 表格列配置
const columns = ref([
 
  { title: 'ID', width: '80px', key:'index' },
  { title: '头像', width: '80px', customSlot: 'avatar', key: 'profile_image_url' },
  { title: '交易员名称', width: '150px', key: 'trader_name', sort: 'desc' },
  { title: '专业头衔', width: '180px', key: 'professional_title' },
  { title: '总利润', width: '120px', key: 'total_profit' },
  { title: '总交易次数', width: '120px', key: 'total_trades' },
  { title: '胜率', width: '100px', key: 'win_rate' },
  { title: '月度利润', width: '120px', key: 'monthly_profit' },
  { title: '关注人数', width: '100px', key: 'followers_count' },
  { title: '点赞数', width: '100px', key: 'likes_count' },
  { title: '创建时间', width: '180px', key: 'created_at' },
  { title: '操作', width: '150px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  trader_name: '',
  professional_title: '',
  profile_image_url: '',
  total_profit: 0,
  total_trades: 0,
  win_rate: 0,
  followers_count: 0,
  likes_count: 0,
  monthly_profit: 0
})

// 图片上传相关
const avatarFile = ref<File | null>(null)
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 图片上传前校验
const beforeUpload10 = (file: File) => {
  layer.load(0, {time: 5000})
  const isImage = file.type.indexOf('image/') === 0
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    layer.msg('上传文件只能是图片格式!', { icon: 2 })
    layer.closeAll()
    return false
  }
  if (!isLt2M) {
    layer.msg('上传图片大小不能超过 2MB!', { icon: 2 })
    layer.closeAll()
    return false
  }
  return true
}

// 图片上传成功处理
const handleUploadSuccess = (response: any) => {
  layer.closeAll()
   try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      // 将上传成功后的视频URL赋值给video_url字段
      model11.value.profile_image_url = updataData.data.url;
      layer.msg('上传成功', { icon: 1 });
    } else {
      layer.msg('上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('上传失败，请重试', { icon: 2 });
  }
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    trader_name: '',
    professional_title: ''
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
const change = async (pageData: any) => {
  // 使用传入的page对象更新当前分页信息
  if (pageData) {
    page.current = pageData.current || 1;
    page.limit = pageData.limit || 10;
  }

  loading.value = true
  try {
    // 构建请求参数
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      trader_name: searchQuery.value.trader_name,
      professional_title: searchQuery.value.professional_title
    }
    
    // 调用API获取交易员排行榜列表
    const { data, success, total } = await getList(params)
    if (success) {
      data.forEach((item: LeaderboardTrader, index: number) => {
        item.index = index + 1
      })
      // 更新数据源
      dataSource.value = (data || []).map((item: any) => formatDatesForDisplay(item, ['created_at']))
      // 处理分页逻辑
      page.total = total || 0;
    } else {
      // 如果API调用失败，使用模拟数据
    
      layer.msg('获取交易员排行榜失败，显示模拟数据', { icon: 2 })
    }
  } catch (error) {
    console.error('获取交易员排行榜异常:', error)
    layer.msg('获取交易员排行榜异常，显示模拟数据', { icon: 2 })
    // 使用模拟数据
 
  } finally {
    loading.value = false
  }
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
          
          try {
            // 批量删除交易员排行榜数据
            for (const traderId of selectedKeys.value) {
              await del(Number(traderId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            loading.value = true
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除交易员排行榜异常:', error)
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
const changeVisible11 = (text: string, row?: LeaderboardTrader) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      trader_name: '',
      professional_title: '',
      profile_image_url: '',
      total_profit: 0,
      total_trades: 0,
      win_rate: 0,
      followers_count: 0,
      likes_count: 0,
      monthly_profit: 0,
      trader_uuid: ''
    }
  }
  visible11.value = true
}

// 提交表单
async function toSubmit() {
  try {
    // 表单验证
    if (!model11.value.trader_name) {
      layer.msg('交易员名称不能为空', { icon: 3 });
      loading.value = false;
      return;
    }
    if (!model11.value.professional_title) {
      layer.msg('专业头衔不能为空', { icon: 3 });
      loading.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      trader_name: model11.value.trader_name,
      professional_title: model11.value.professional_title,
      profile_image_url: model11.value.profile_image_url || '',
      total_profit: parseFloat(model11.value.total_profit) || 0,
      total_trades: parseInt(model11.value.total_trades) || 0,
      win_rate: parseFloat(model11.value.win_rate) || 0,
      followers_count: parseInt(model11.value.followers_count) || 0,
      likes_count: parseInt(model11.value.likes_count) || 0,
      monthly_profit: parseFloat(model11.value.monthly_profit) || 0,
      trader_uuid: model11.value.trader_uuid || ''
    };
    
   
    
    if (model11.value.id) {
      // 编辑交易员排行榜数据
      const response = await update(model11.value.id, submitData);
      loading.value = false;
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
      // 新增交易员排行榜数据
      const response = await create(submitData);
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

// 确认删除单个交易员排行榜数据
async function confirm(data: LeaderboardTrader) {
  try {
    const response = await del(data.id);
    if (response.success) {
      layer.msg('删除成功', { icon: 1 });
      // 刷新数据
      loading.value = true
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除交易员排行榜异常:', error);
    layer.msg('删除交易员排行榜异常', { icon: 2 });
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 查看图片放大
function viewImage(imageUrl: string) {
  // 创建图片预览层
  layer.photos({
    imgList:[{src:imageUrl,alt:'交易员头像'}]
  })
}
</script>
<style scoped>
.leaderboard-traders-box {
  padding: 15px;
  background-color: #f5f5f5;
  height: 100vh;
  overflow: hidden;
}

.table-box {
  margin-top: 10px;
  background-color: white;
  padding: 15px;
  border-radius: 4px;
  height: calc(100% - 140px);
  overflow: hidden;
}
</style>