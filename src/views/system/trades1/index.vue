<template>
  <lay-container fluid="true" class="trades1-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="股票代码" label-width="80">
              <lay-input
                v-model="searchQuery.symbol"
                placeholder="请输入股票代码"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易市场" label-width="80">
             
               <lay-select v-model="searchQuery.trade_market">
                 <lay-select-option value="">全部</lay-select-option>
              <lay-select-option v-for="market in tradeMarkets" :key="market.label" :value="market.label">{{ market.label }}</lay-select-option>
            </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易方向" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.direction"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="1" label="买入"></lay-select-option>
                <lay-select-option value="-1" label="卖出"></lay-select-option>
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
        <template v-slot:direction="{ row }">
          <span v-if="row.direction === 1" style="color: green">买入</span>
          <span v-else-if="row.direction === -1" style="color: red">卖出</span>
          <span v-else>未知</span>
        </template>
        <template v-slot:entry_date="{ row }">
          <span>{{ formatUSDate(row.entry_date) }}</span>
        </template>
        <template v-slot:size="{ row }">
          <span>{{ formatQuantity(row.size) }}</span>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此交易记录吗?"
            @confirm="confirm(row)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
        <template v-slot:image="{ row }">
          <div v-if="row.image_url && row.image_url !== ''" @click="viewImage(row.image_url)" style="cursor: pointer;">
            <img :src="row.image_url" alt="交易图片" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          </div>
          <span v-else style="color: #999;">无图片</span>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['750px', '700px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
           <lay-form-item label="交易市场" prop="trade_market">
            <lay-select v-model="model11.trade_market">
              <lay-select-option v-for="market in tradeMarkets" :key="market.label" :value="market.label">{{ market.label }}</lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="交易方向" prop="direction">
            <lay-select v-model="model11.direction">
              <lay-select-option :value="1" label="买入"></lay-select-option>
              <lay-select-option :value="-1" label="卖出"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="股票代码" prop="symbol">
            <lay-input v-model="model11.symbol" placeholder="请输入股票代码"></lay-input>
          </lay-form-item>
          <lay-form-item label="入场价格" prop="entry_price">
            <lay-input v-model="model11.entry_price" type="number" placeholder="请输入入场价格"></lay-input>
          </lay-form-item>
          <lay-form-item label="入场日期" prop="entry_date">
            <lay-input v-model="model11.entry_date" type="datetime-local" placeholder="请输入入场日期"></lay-input>
          </lay-form-item>
          <lay-form-item label="交易数量" prop="size">
            <lay-input
              v-model="model11.size"
              placeholder="请输入交易数量（支持两位小数，如 33580.50）"
            ></lay-input>
          </lay-form-item>
          <lay-form-item label="出场价格" prop="exit_price" v-if="model11.id>0">
            <lay-input v-model="model11.exit_price" type="number" placeholder="请输入出场价格"></lay-input>
          </lay-form-item>
          <lay-form-item label="出场日期" prop="exit_date" v-if="model11.id>0">
            <lay-input v-model="model11.exit_date" type="datetime-local" placeholder="请输入出场日期"></lay-input>
          </lay-form-item>
          <lay-form-item label="重点交易" prop="is_important">
            <lay-switch v-model="model11.is_important"></lay-switch>
            <span style="margin-left: 10px; color: #666; font-size: 12px;">标记为重点交易后，将在首页置顶显示</span>
          </lay-form-item>
          <lay-form-item label="交易图片" prop="image_url" :label-width="100" mode="inline" :inlineWidth="350" v-if="model11.id>0">
            <lay-input v-model="model11.image_url" placeholder="交易图片URL" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-form-item :label-width="100" mode="inline" v-if="model11.id>0">
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
import { ref, reactive, onMounted, watch } from 'vue'
import { layer } from '@layui/layui-vue'
import { getTrades1, createTrade1, updateTrade1, deleteTrade1 } from '../../../api/module/trades1'
import { getTradeMarkets } from '../../../api/module/tradeMarket'
import { formatUSDate } from '@/utils/dateFormat'
import { parseShareSize, formatQuantity } from '@/utils/formatNumber'
const uploadvideosUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/images":"https://houduan-api.onrender.com/api/upload/images"
// 定义交易员交易记录接口
interface Trade1 {
  id: number;
  symbol: string;
  entry_date: string;
  entry_price: number;
  size: number;
  exit_date?: string | null;
  exit_price?: number | null;
  current_price?: number | null;
  image_url?: string | null;
  trade_market: string;
  direction: number;
  trader_uuid?: string;
  is_important?: boolean;
}

// 搜索条件
const searchQuery = ref({
  symbol: '',
  trade_market: '',
  direction: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<Trade1[]>([])

// 初始化时添加一些模拟数据以便立即看到效果
const mockData: Trade1[] = [
  {
    id: 1,
    symbol: 'AAPL',
    entry_date: '2024-01-01 10:00:00',
    entry_price: 180.5,
    size: 100,
    exit_date: '2024-01-10 15:30:00',
    exit_price: 195.25,
    current_price: 190.75,
    image_url: '',
    trade_market: 'US',
    direction: 1,
    trader_uuid: 'test-uuid'
  },
  {
    id: 2,
    symbol: 'TSLA',
    entry_date: '2024-01-05 09:30:00',
    entry_price: 215.8,
    size: 50,
    exit_date: '',
    exit_price: null,
    current_price: 228.4,
    image_url: '',
    trade_market: 'US',
    direction: 1,
    trader_uuid: 'test-uuid'
  },
  {
    id: 3,
    symbol: 'MSFT',
    entry_date: '2024-01-03 14:20:00',
    entry_price: 375.25,
    size: 75,
    exit_date: '2024-01-15 11:45:00',
    exit_price: 392.8,
    current_price: 0,
    image_url: '',
    trade_market: 'US',
    direction: 1,
    trader_uuid: 'test-uuid'
  }
]

// 表格列配置
const columns = ref([
  
  { title: 'ID', width: '80px', key: 'id' },
  { title: '股票代码', width: '120px', key: 'symbol', sort: 'desc' },
  { title: '入场价格', width: '120px', key: 'entry_price' },
  { title: '入场日期', width: '180px', key: 'entry_date', customSlot: 'entry_date' },
  { title: '交易数量', width: '120px', key: 'size', customSlot: 'size' },
  { title: '出场价格', width: '120px', key: 'exit_price' },
  { title: '出场日期', width: '180px', key: 'exit_date' },
  { title: '当前价格', width: '120px', key: 'current_price' },
  { title: '交易市场', width: '100px', key: 'trade_market' },
  { title: '交易方向', width: '100px', customSlot: 'direction' },
  { title: '交易图片', width: '100px', customSlot: 'image', key: 'image_url' },
  { title: '操作', width: '150px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 交易市场列表
const tradeMarkets = ref<Array<{value: string, label: string}>>([])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  symbol: '',
  entry_date: '',
  entry_price: 0,
  size: '',
  exit_date: '',
  exit_price: null,
  current_price: null,
  image_url: '',
  trade_market: 'US',
  direction: 1,
  is_important: false
})

// 保存状态
const isSaving = ref(false)

// 图片上传相关
const avatarFile = ref<File | null>(null)
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 初始化加载数据
onMounted(() => {
  change(page)
  loadTradeMarkets()
})

// 加载交易市场列表
const loadTradeMarkets = async () => {
  try {
    const { data, success } = await getTradeMarkets()
    if (success && data) {
      tradeMarkets.value = data.map((item: any) => ({
        value: item.marketname,
        label: item.marketname
      }))
    } else {
      // 如果获取失败，使用默认市场列表
      tradeMarkets.value = [
       
      ]
    }
  } catch (error) {
    console.error('获取交易市场列表异常:', error)
    // 使用默认市场列表
    tradeMarkets.value = [
     
    ]
  }
}

// 图片上传前校验
const beforeUpload10 = (file: File) => {
  layer.load(0, {time: 3000})
  const isImage = file.type.indexOf('image/') === 0
  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isImage) {
    layer.msg('上传文件只能是图片格式!', { icon: 2 })
    return false
  }
  if (!isLt2M) {
    layer.msg('上传图片大小不能超过 2MB!', { icon: 2 })
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
      model11.value.image_url = updataData.data.url;
     
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
    symbol: '',
    trade_market: '',
    direction: ''
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
      search: searchQuery.value.symbol,
      trade_market: searchQuery.value.trade_market,
      direction: searchQuery.value.direction
    }
    
    // 调用API获取交易记录列表
    const { data, success, total } = await getTrades1(params)
    if (success) {
      // 更新数据源
      dataSource.value = data || []
      // 调试：检查第一条数据的 is_important 字段
      if (data && data.length > 0) {
        console.log('📋 列表数据第一条记录的 is_important:', data[0].is_important, '类型:', typeof data[0].is_important);
        console.log('📋 列表数据第一条记录:', data[0]);
      }
      // 处理分页逻辑
      page.total = total || 0;
    } else {
      // 如果API调用失败，使用模拟数据
      dataSource.value = mockData
      page.total = mockData.length
      layer.msg('获取交易记录失败，显示模拟数据', { icon: 2 })
    }
  } catch (error) {
    console.error('获取交易记录异常:', error)
    layer.msg('获取交易记录异常，显示模拟数据', { icon: 2 })
    // 使用模拟数据
    dataSource.value = mockData
    page.total = mockData.length
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
            // 批量删除交易记录
            for (const tradeId of selectedKeys.value) {
              await deleteTrade1(Number(tradeId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            loading.value = true
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除交易记录异常:', error)
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

// 限制交易数量输入为最多两位小数
function sanitizeDecimalInput(value: string): string {
  let v = value.replace(/[^\d.]/g, '')
  const dotIndex = v.indexOf('.')
  if (dotIndex !== -1) {
    const intPart = v.slice(0, dotIndex)
    const decPart = v.slice(dotIndex + 1).replace(/\./g, '').slice(0, 2)
    v = decPart.length > 0 ? `${intPart}.${decPart}` : `${intPart}.`
  }
  return v
}

watch(
  () => model11.value.size,
  (val) => {
    const sanitized = sanitizeDecimalInput(String(val ?? ''))
    if (sanitized !== val) {
      model11.value.size = sanitized
    }
  }
)

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: Trade1) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    console.log('📖 打开编辑对话框，原始 row 数据:', row);
    console.log('📖 row.is_important 原始值:', row.is_important, '类型:', typeof row.is_important);
    const isImportantValue = row.is_important === true || row.is_important === 1 || row.is_important === 'true' || row.is_important === '1';
    console.log('📖 转换后的 is_important 值:', isImportantValue);
    model11.value = { 
      ...row,
      size: row.size != null && row.size !== '' ? String(parseShareSize(row.size)) : '',
      // 确保 is_important 是 boolean 类型
      is_important: isImportantValue
    }
    console.log('📖 model11.value.is_important 最终值:', model11.value.is_important);
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      symbol: '',
      entry_date: new Date().toISOString().slice(0, 16),
      entry_price: 0,
      size: '',
      exit_date: '',
      exit_price: null,
      current_price: null,
      image_url: '',
      trade_market: 'US',
      direction: 1,
      is_important: false
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
  
  try {
    // 设置保存状态
    isSaving.value = true;
    
    // 表单验证
    if (!model11.value.symbol) {
      layer.msg('股票代码不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.entry_price) {
      layer.msg('入场价格不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    const sizeNum = parseShareSize(model11.value.size)
    if (!sizeNum || sizeNum <= 0) {
      layer.msg('交易数量不能为空或无效', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.entry_date) {
      layer.msg('入场日期不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象
    // 确保 is_important 字段总是被发送（即使是 false）
    const isImportantValue = model11.value.is_important === true || 
                             model11.value.is_important === 1 || 
                             model11.value.is_important === 'true' ||
                             model11.value.is_important === '1';
    
    console.log('提交 is_important 值:', model11.value.is_important, '转换为:', isImportantValue);
    
    const submitData: any = {
      symbol: model11.value.symbol,
      entry_date: model11.value.entry_date,
      entry_price: parseFloat(model11.value.entry_price),
      size: sizeNum,
      exit_date: model11.value.exit_date || null,
      exit_price: model11.value.exit_price ? parseFloat(model11.value.exit_price) : null,
      current_price: model11.value.current_price ? parseFloat(model11.value.current_price) : null,
      image_url: model11.value.image_url || null,
      trade_market: model11.value.trade_market,
      direction: parseInt(model11.value.direction),
      is_important: isImportantValue  // 明确设置为 boolean
    };
    
    if (model11.value.id) {
      // 编辑交易记录
      const response = await updateTrade1(model11.value.id, submitData);
      console.log('✅ 后端返回的响应:', response);
      // 修复：response.data 可能是数组，需要访问第一个元素
      const responseData = Array.isArray(response.data) ? response.data[0] : response.data;
      console.log('✅ 后端返回的 is_important:', responseData?.is_important);
      console.log('✅ 后端返回的完整数据:', responseData);
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
      // 新增交易记录
      const response = await createTrade1(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '新增失败', { icon: 2 });
      }
    }
  } catch (error: any) {
    console.error('提交表单异常:', error);
    const details = String(error?.response?.data?.details || '');
    const backendError = String(error?.response?.data?.error || '');
    let message = backendError || details || '操作失败，请稍后重试';
    if (details.includes('integer') || backendError.includes('整数')) {
      message = '交易数量小数保存失败：数据库 size 字段仍是整数类型，需要在 Supabase 执行升级 SQL';
    }
    layer.msg(message, { icon: 2, time: 5000 });
  } finally {
    // 重置保存状态
    isSaving.value = false;
  }
}

// 关闭对话框
function toCancel() {
  visible11.value = false
}

// 确认删除单个交易记录
async function confirm(data: Trade1) {
 
  try {
    const response = await deleteTrade1(data.id);
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
    console.error('删除交易记录异常:', error);
    layer.msg('删除交易记录异常', { icon: 2 });
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
      imgList:[{src:imageUrl,alt:'layer for vue'}]
    })
 
}
</script>

<style scoped>
.trades1-box {
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