<template>
  <lay-container fluid="true" class="trade-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="搜索" label-width="80">
              <lay-input
                v-model="searchQuery.search"
                placeholder="请输入搜索内容"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易市场" label-width="80">
              <lay-select
                v-model="searchQuery.trade_market"
                placeholder="请选择"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              >
                <lay-select-option value="">全部</lay-select-option>
                <lay-select-option
                v-for="market in tradeMarkets"
                :key="market.label"
                :value="market.value"
              >
                {{ market.label }}
              </lay-select-option>
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
            <lay-icon class="layui-icon-add"></lay-icon>
            新增
          </lay-button>
        
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此VIP交易记录吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['850px', '500px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" label-width="130px" required>
          <lay-form-item label="交易市场" prop="trade_market" mode="inline">
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

          <lay-form-item label="股票代码" prop="symbol" mode="inline">
              <lay-input v-model="model11.symbol"></lay-input>
            </lay-form-item>
        
            <lay-form-item label="交易方向" prop="direction" mode="inline">
              <lay-select v-model="model11.direction">
                <lay-select-option :value="1">买入</lay-select-option>
                <lay-select-option :value="-1">卖出</lay-select-option>
              </lay-select>
            </lay-form-item>
            <lay-form-item label="资产类型" prop="asset_type" mode="inline">
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

          <lay-form-item label="入场价格" prop="entry_price" mode="inline">
            <lay-input v-model="model11.entry_price" type="number"></lay-input>
          </lay-form-item>
         
          <lay-form-item label="数量" prop="size" mode="inline">
            <lay-input v-model="model11.quantity" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="入场日期" prop="entry_time">
            <lay-input v-model="model11.entry_time" type="datetime-local"></lay-input>
          </lay-form-item>
          
       
          
          <lay-form-item label="出场价格" prop="exit_price" v-if="model11.id>0">
            <lay-input v-model="model11.exit_price" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="出场日期" prop="exit_time" v-if="model11.id>0">
            <lay-input v-model="model11.exit_time" type="datetime-local"></lay-input>
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
import { ref, reactive, onMounted } from 'vue';
import { layer } from '@layui/layui-vue';
import { getVipTrades, getVipTradeById, createVipTrade, updateVipTrade, deleteVipTrade } from '@/api/module/vipTrades';
import { getTradeMarkets } from '@/api/module/tradeMarket';
import { formatDatesForDisplay } from '@/utils/dateFormat';

// 定义VIP交易记录接口
interface VipTrade {
  id: string;
  created_by: string;
  symbol: string;
  entry_price: number;
  exit_price: number | null;
  size: number;
  entry_time: string | null;
  exit_time: string | null;
  current_price: number | null;
  image_url: string | null;
  trade_type: string;
  direction: number;
  asset_type: string;
  trade_market: string;
  created_at: string;
  updated_at: string | null;
  trader_uuid?: string;
  status?: string;
}

// 搜索条件
const searchQuery = ref({
  search: '',
  trade_market: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<VipTrade[]>([])

// 表格列配置
const columns = ref([
 
  { title: '股票代码', width: '100px', key: 'symbol' },
  { title: '交易类型', width: '100px', key: 'trade_type' },
  { title: '交易方向', width: '100px', customSlot: 'direction', key: 'direction' },
  { title: '资产类型', width: '120px', key: 'asset_type' },
  { title: '入场价格', width: '100px', key: 'entry_price' },
  { title: '出场价格', width: '100px', key: 'exit_price' },
  { title: '数量', width: '100px', key: 'quantity' },
  { title: '入场日期', width: '160px', key: 'entry_time' },
  { title: '创建时间', width: '160px', key: 'created_at' },
  { title: '交易市场', width: '100px', key: 'trade_market' },

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
const tradeMarkets = ref<Array<{value: string, label: string}>>([])

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

// 搜索
function toSearch() {
  page.current = 1
  change(page)
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    search: '',
    trade_market: ''
  }
  toSearch()
}

// 分页改变时加载数据
async function change(page: any) {
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
      search: searchQuery.value.search,
      trade_market: searchQuery.value.trade_market
    }
    
    // 调用API获取VIP交易记录列表
    const response = await getVipTrades(params)
    if (response && !response.error) {
      dataSource.value = (response.data || []).map((item: any) => formatDatesForDisplay(item, ['created_at']))
      page.total = response.total || 0;
    } else {
      layer.msg(response?.error || '获取VIP交易记录列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取VIP交易记录列表异常:', error)
    layer.msg('获取VIP交易记录列表异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
function sortChange(field: string, order: string) {
  // 实现排序逻辑
  console.log('排序字段:', field, '排序顺序:', order)
  // 这里可以根据需要实现数据排序
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
            let allSuccess = true
            for (const tradeId of selectedKeys.value) {
              const result = await deleteVipTrade(tradeId)
              if (result && result.error) {
                allSuccess = false
                break
              }
            }
            
            if (allSuccess) {
              layer.msg('删除成功', { icon: 1 })
            } else {
              layer.msg('部分记录删除失败', { icon: 2 })
            }
              loading.value = true
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除VIP交易记录异常:', error)
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

// 确认删除单个交易记录
async function confirmDelete(id: string) {
  loading.value = true
  try {
    const result = await deleteVipTrade(id)
    
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
    console.error('删除VIP交易记录异常:', error)
    
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
const changeVisible11 = (text: string, row?: VipTrade) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
    // 格式化日期时间为本地时间格式
    if (model11.value.entry_time) {
      model11.value.entry_time = formatDateTimeForInput(model11.value.entry_time)
    }
    if (model11.value.exit_time) {
      model11.value.exit_time = formatDateTimeForInput(model11.value.exit_time)
    }
  } else {
    // 新增模式，清空表单
    model11.value = {
      created_by: '',
      symbol: '',
      entry_price: 0,
      exit_price: null,
      size: 0,
      entry_time: '',
      exit_time: '',
      current_price: null,
      image_url: '',
      trade_type: 'manual',
      direction: 1,
      asset_type: 'stock',
      trade_market: '',
      status: null,
      trader_uuid: ''
    }
  }
  visible11.value = true
}

// 格式化日期时间为输入框格式
function formatDateTimeForInput(dateTime: string | null): string {
  if (!dateTime) return ''
  try {
    const date = new Date(dateTime)
    // 格式化为YYYY-MM-DDTHH:mm格式，符合datetime-local输入要求
    return date.toISOString().slice(0, 16)
  } catch (error) {
    console.error('格式化日期时间失败:', error)
    return ''
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
    if (!model11.value.symbol || model11.value.entry_price === undefined || model11.value.quantity === undefined || !model11.value.entry_time) {
      layer.msg('股票代码、入场价格、数量和入场日期不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = {
      symbol: model11.value.symbol,
      asset_type: model11.value.asset_type,
      direction: model11.value.direction,
      entry_time: model11.value.entry_time,
      entry_price: model11.value.entry_price,
      quantity: model11.value.quantity,
      current_price: model11.value.current_price,
      image_url: model11.value.image_url,
      trade_type: model11.value.trade_type,
      status: model11.value.status,
      exit_price: model11.value.exit_price,
      exit_time: model11.value.exit_time,
      created_by: model11.value.created_by,
      trade_market: model11.value.trade_market,
      updated_at: new Date().toISOString()
    };
    
    // 添加当前登录用户的trader_uuid
    const currentUser = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (currentUser.trader_uuid) {
      submitData.trader_uuid = currentUser.trader_uuid;
    }
    
    if (model11.value.id) {
      // 编辑交易记录
      const result = await updateVipTrade(model11.value.id, submitData);
      if (result && !result.error) {
        layer.msg('更新成功', { icon: 1 });
        visible11.value = false;
        loading.value = true;
        // 刷新数据
        change(page);
      } else {
        layer.msg(result?.error || '更新失败', { icon: 2 });
      }
    } else {
      // 新增交易记录
      const result = await createVipTrade(submitData);
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
  model11.value = {}
}

// 取消删除
function cancel() {
  // 取消删除操作的处理
}

// 图片预览
function viewImage(imageUrl: string) {
  layer.open({
    type: 1,
    title: false,
    closeBtn: 1,
    area: ['auto', 'auto'],
    skin: 'layui-layer-nobg', // 没有背景色
    shadeClose: true,
    content: `<div style="padding: 20px;"><img src="${imageUrl}" alt="交易图片" style="max-width: 100%; max-height: 80vh;"></div>`
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