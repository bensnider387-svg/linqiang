<template>
  <lay-container fluid="true" class="trade-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="股票代码" label-width="80">
              <lay-input
                v-model="searchQuery.symbol"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易类型" label-width="80">
              <lay-select
                v-model="searchQuery.trade_type"
                placeholder="请选择"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              >
                <lay-select-option value="manual">手动</lay-select-option>
                <lay-select-option value="auto">自动</lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="资产类型" label-width="80">
              <lay-select
                v-model="searchQuery.asset_type"
                placeholder="请选择"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              >
                <lay-select-option value="stock">股票</lay-select-option>
                <lay-select-option value="forex">外汇</lay-select-option>
                <lay-select-option value="crypto">加密货币</lay-select-option>
                <lay-select-option value="fund">基金</lay-select-option>
                <lay-select-option value="options">期权</lay-select-option>
                <lay-select-option value="futures">期货</lay-select-option>
                <lay-select-option value="commodity">商品</lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易方向" label-width="80">
              <lay-select
                v-model="searchQuery.direction"
                placeholder="请选择"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              >
                <lay-select-option value="1">买入</lay-select-option>
                <lay-select-option value="-1">卖出</lay-select-option>
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
        <template v-slot:entry_date="{ row }">
          <span>{{ formatUSDate(row.entry_date) }}</span>
        </template>
        <template v-slot:created_at="{ row }">
          <span>{{ formatUSDate(row.created_at) }}</span>
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
            @confirm="confirmDelete(row.id)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
        <template v-slot:direction="{ row }">
          <span v-if="row.direction === 1" style="color: green">买入</span>
          <span v-else-if="row.direction === -1" style="color: red">卖出</span>
          <span v-else>未知</span>
        </template>
        <template v-slot:profit="{ row }">
          <span :style="row.profit >= 0 ? { color: 'green' } : { color: 'red' }">
            {{ row.profit || 0 }}
          </span>
        </template>
        <template v-slot:image="{ row }">
          <div v-if="row.image_url" @click="viewImage(row.image_url)" style="cursor: pointer;">
            <img :src="row.image_url" alt="交易图片" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px;">
          </div>
          <span v-else style="color: #999;">无图片</span>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['650px', '600px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="用户ID" prop="user_id">
            <lay-input v-model="model11.user_id"></lay-input>
          </lay-form-item>
          <lay-form-item label="用户名" prop="username">
            <lay-input v-model="model11.username"></lay-input>
          </lay-form-item>
          <lay-form-item label="股票代码" prop="symbol">
            <lay-input v-model="model11.symbol"></lay-input>
          </lay-form-item>
          <lay-form-item label="交易类型" prop="trade_type">
            <lay-select v-model="model11.trade_type">
              <lay-select-option value="manual">手动</lay-select-option>
              <lay-select-option value="auto">自动</lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="交易方向" prop="direction">
            <lay-select v-model="model11.direction">
              <lay-select-option :value="1">买入</lay-select-option>
              <lay-select-option :value="-1">卖出</lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="资产类型" prop="asset_type">
            <lay-select v-model="model11.asset_type">
              <lay-select-option value="stock">股票</lay-select-option>
              <lay-select-option value="forex">外汇</lay-select-option>
              <lay-select-option value="crypto">加密货币</lay-select-option>
              <lay-select-option value="fund">基金</lay-select-option>
              <lay-select-option value="options">期权</lay-select-option>
              <lay-select-option value="futures">期货</lay-select-option>
              <lay-select-option value="commodity">商品</lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="入场价格" prop="entry_price">
            <lay-input v-model="model11.entry_price" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="出场价格" prop="exit_price">
            <lay-input v-model="model11.exit_price" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="数量" prop="size">
            <lay-input v-model="model11.size" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="入场日期" prop="entry_date">
            <lay-input v-model="model11.entry_date" type="datetime-local"></lay-input>
          </lay-form-item>
          <lay-form-item label="出场日期" prop="exit_date">
            <lay-input v-model="model11.exit_date" type="datetime-local"></lay-input>
          </lay-form-item>
          <lay-form-item label="利润" prop="profit">
            <lay-input v-model="model11.profit" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="交易市场" prop="trade_market">
            <lay-select v-model="model11.trade_market">
              <lay-select-option
                v-for="market in tradeMarkets"
                :key="market.label"
                :value="market.value"
              >
                {{ market.label }}
              </lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="图片URL" prop="image_url">
            <lay-input v-model="model11.image_url"></lay-input>
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
import { ref, reactive, onMounted } from 'vue';
import { layer } from '@layui/layui-vue';
import { getTrades, getTradeById, createTrade, updateTrade, deleteTrade } from '../../../api/module/trades';
import { getTradeMarkets } from '../../../api/module/tradeMarket';
import { formatUSDate } from '@/utils/dateFormat';

// 定义交易记录接口
interface Trade {
  id: string;
  user_id: string;
  username: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  size: number;
  entry_date: string | null;
  exit_date: string | null;
  current_price: number | null;
  image_url: string | null;
  trade_type: string;
  direction: number;
  asset_type: string;
  trader_uuid: string;
  trade_market: string;
  profit: number;
  exchange_rate: number | null;
  created_at: string;
  updated_at: string | null;
}

// 搜索条件
const searchQuery = ref({
  symbol: '',
  trade_type: '',
  direction: '',
  asset_type: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<Trade[]>([])

// 表格列配置
const columns = ref([
 
  { title: '股票代码', width: '100px', key: 'symbol' },
  { title: '用户名', width: '120px', key: 'username' },
  { title: '交易类型', width: '100px', key: 'trade_type' },
  { title: '交易方向', width: '100px', customSlot: 'direction', key: 'direction' },
  { title: '资产类型', width: '120px', key: 'asset_type' },
  { title: '入场价格', width: '100px', key: 'entry_price' },
  { title: '出场价格', width: '100px', key: 'exit_price' },
  { title: '数量', width: '100px', key: 'size' },
  { title: '利润', width: '100px', customSlot: 'profit', key: 'profit', sort: 'desc' },
  { title: '入场日期', width: '160px', key: 'entry_date', customSlot: 'entry_date' },
  { title: '创建时间', width: '160px', key: 'created_at', customSlot: 'created_at' },
  { title: '交易图片', width: '100px', customSlot: 'image', key: 'image_url' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 保存状态
const isSaving = ref(false)

// 交易市场列表
const tradeMarkets = ref([
  { value: 'US', label: '美国' },
  { value: 'HK', label: '香港' },
  { value: 'CN', label: '中国' }
])

// 初始化加载数据
onMounted(() => {
  change(page)
  loadTradeMarkets()
})

// 加载交易市场列表
async function loadTradeMarkets() {
  try {
    const response = await getTradeMarkets()
    if (response && response.data && response.data.length > 0) {
      // 格式化市场数据
      tradeMarkets.value = response.data.map((item: any) => ({
        value: item.marketname,
        label: item.marketname
      }))
    }
  } catch (error) {
    console.error('获取交易市场列表异常:', error)
    // 使用默认市场列表
    tradeMarkets.value = [
      { value: 'US', label: '美国' },
      { value: 'HK', label: '香港' },
      { value: 'CN', label: '中国' }
    ]
  }
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    symbol: '',
    trade_type: '',
    direction: '',
    asset_type: ''
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
      symbol: searchQuery.value.symbol,
      trade_type: searchQuery.value.trade_type,
      direction: searchQuery.value.direction,
      asset_type: searchQuery.value.asset_type,
      page: page.current
    }
    
    // 调用API获取交易记录列表
    const response = await getTrades(params)
    if (response && !response.error) {
      dataSource.value = response.data || []
      page.total = response.total || 0;
    } else {
      layer.msg(response?.error || '获取交易记录列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取交易记录列表异常:', error)
    layer.msg('获取交易记录列表异常', { icon: 2 })
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
            // 批量删除交易记录
            let successCount = 0
            let failCount = 0
            const errors: string[] = []
            
            for (const tradeId of selectedKeys.value) {
              try {
                const result = await deleteTrade(tradeId)
                
                if (result && result.success) {
                  successCount++
                } else if (result && result.success === false) {
                  failCount++
                  errors.push(result.message || `记录 ${tradeId} 删除失败`)
                } else if (result && !result.error) {
                  successCount++
                } else {
                  failCount++
                  errors.push(result?.error || result?.message || `记录 ${tradeId} 删除失败`)
                }
              } catch (error: any) {
                failCount++
                errors.push(`记录 ${tradeId}: ${error.message || '删除异常'}`)
              }
            }
            
            if (failCount === 0) {
              layer.msg(`成功删除 ${successCount} 条记录`, { icon: 1 })
            } else if (successCount === 0) {
              layer.msg(`删除失败: ${errors[0]}`, { icon: 2 })
            } else {
              layer.msg(`成功删除 ${successCount} 条，失败 ${failCount} 条`, { icon: 2 })
            }
            
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error: any) {
            console.error('批量删除交易记录异常:', error)
            layer.msg('批量删除失败: ' + (error.message || '未知错误'), { icon: 2 })
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

// 确认删除单个交易记录
async function confirmDelete(id: string) {
  loading.value = true
  try {
    const result = await deleteTrade(id)
    
    // 检查响应格式
    if (result && result.success) {
      layer.msg('删除成功', { icon: 1 })
      // 刷新数据
      change(page)
    } else if (result && result.success === false) {
      layer.msg(result.message || '删除失败', { icon: 2 })
    } else if (result && !result.error) {
      layer.msg('删除成功', { icon: 1 })
      // 刷新数据
      change(page)
    } else {
      layer.msg(result?.error || result?.message || '删除失败', { icon: 2 })
    }
  } catch (error: any) {
    console.error('删除交易记录异常:', error)
    
    // 更详细的错误信息
    let errorMessage = '删除异常'
    if (error.response) {
      const status = error.response.status
      const message = error.response.data?.message || error.response.data?.msg
      
      if (status === 401) {
        errorMessage = '未授权，请重新登录'
      } else if (status === 403) {
        errorMessage = '没有权限删除此记录'
      } else if (status === 404) {
        errorMessage = '记录不存在'
      } else if (status >= 500) {
        errorMessage = '服务器错误'
      } else if (message) {
        errorMessage = message
      }
    } else if (error.request) {
      errorMessage = '网络连接失败'
    } else if (error.message) {
      errorMessage = error.message
    }
    
    layer.msg(errorMessage, { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: Trade) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
    // 格式化日期时间为本地时间格式
    if (model11.value.entry_date) {
      model11.value.entry_date = formatDateTimeForInput(model11.value.entry_date)
    }
    if (model11.value.exit_date) {
      model11.value.exit_date = formatDateTimeForInput(model11.value.exit_date)
    }
  } else {
    // 新增模式，清空表单
    model11.value = {
      user_id: '',
      username: '',
      symbol: '',
      entry_price: 0,
      exit_price: null,
      size: 0,
      entry_date: '',
      exit_date: '',
      current_price: null,
      image_url: '',
      trade_type: 'manual',
      direction: 1,
      asset_type: 'stock',
      trader_uuid: '',
      trade_market: '',
      profit: 0,
      exchange_rate: null
    }
  }
  visible11.value = true
}

// 格式化日期时间为input元素的datetime-local格式
function formatDateTimeForInput(dateString: string): string {
  if (!dateString) return ''
  try {
    // 处理不同格式的日期字符串
    let date: Date
    if (dateString.includes('T')) {
      date = new Date(dateString)
    } else if (dateString.includes(' ')) {
      date = new Date(dateString.replace(' ', 'T'))
    } else {
      return dateString
    }
    // 生成YYYY-MM-DDTHH:mm格式
    return date.toISOString().slice(0, 16)
  } catch (e) {
    console.error('日期格式化失败:', e)
    return dateString
  }
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
    if (!model11.value.user_id || !model11.value.symbol || model11.value.entry_price === undefined || model11.value.size === undefined || !model11.value.trade_type || !model11.value.direction || !model11.value.asset_type || !model11.value.entry_date) {
      layer.msg('用户ID、股票代码、入场价格、数量、交易类型、交易方向、资产类型和入场日期不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = { ...model11.value };
    
    // 添加当前登录用户的trader_uuid
    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (currentUser.trader_uuid) {
      submitData.trader_uuid = currentUser.trader_uuid;
    }
    
    // 添加当前时间作为更新时间
    submitData.updated_at = new Date().toISOString();
    
    if (model11.value.id) {
      // 编辑交易记录
      const result = await updateTrade(model11.value.id, submitData);
      if (result && !result.error) {
        layer.msg('更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(result?.error || '更新失败', { icon: 2 });
      }
    } else {
      // 新增交易记录
      const result = await createTrade(submitData);
      if (result && !result.error) {
        layer.msg('新增成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(result?.error || '新增失败', { icon: 2 });
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

// 查看图片放大
function viewImage(imageUrl: string) {
  // 创建图片预览层
   layer.photos({
      imgList:[{src:imageUrl,alt:'layer for vue'}]
    })
}
</script>

<style scoped>
.trade-box {
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
  height: calc(100% - 130px);
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