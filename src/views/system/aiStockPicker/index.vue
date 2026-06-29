<template>
  <lay-container fluid="true" class="ai-stock-picker-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="股票代码" label-width="80">
              <lay-input
                v-model="searchQuery.symbols"
                placeholder="请输入股票代码"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="交易市场" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.market"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="US" label="美股"></lay-select-option>
                <lay-select-option value="HK" label="港股"></lay-select-option>
                <lay-select-option value="CN" label="A股"></lay-select-option>
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
        @sortChange="sortChange"
      >
      
        <template #market="{ row }">
          <span v-if="row.market === 'US'" class="layui-badge layui-bg-blue">美股</span>
          <span v-else-if="row.market === 'HK'" class="layui-badge layui-bg-green">港股</span>
          <span v-else-if="row.market === 'CN'" class="layui-badge layui-bg-red">A股</span>
          <span v-else>{{ row.market }}</span>
        </template>
        <template #operator="{ row }">
          <lay-button size="sm" @click="changeVisible11('编辑', row)">编辑</lay-button>
          <lay-button size="sm" danger @click="deleteItem(row.id)">删除</lay-button>
        </template>
      </lay-table>
    </div>
    
    <!-- 新增/编辑弹窗 -->
    <lay-layer v-model="visible11" title="{{ title11 }}" :area="['600px', 'auto']">
      <lay-form v-model="model11" :label-width="100" ref="formRef">
        <lay-form-item label="交易市场" prop="market">
          <lay-select v-model="model11.market">
            <lay-select-option value="US">美股</lay-select-option>
            <lay-select-option value="HK">港股</lay-select-option>
            <lay-select-option value="CN">A股</lay-select-option>
          </lay-select>
        </lay-form-item>
        <lay-form-item label="股票代码" prop="symbols">
          <lay-input v-model="model11.symbols"></lay-input>
        </lay-form-item>
        <lay-form-item label="买入价格" prop="put_price">
          <lay-input v-model.number="model11.put_price" placeholder="请输入买入价格"></lay-input>
        </lay-form-item>
        <lay-form-item label="买入时间" prop="put_time">
          <lay-input v-model="model11.put_time" type="datetime-local"></lay-input>
        </lay-form-item>
        <lay-form-item label="当前价格" prop="currprice">
          <lay-input v-model.number="model11.currprice" placeholder="请输入当前价格"></lay-input>
        </lay-form-item>
        <lay-form-item label="目标价格" prop="target_price">
          <lay-input v-model.number="model11.target_price" placeholder="请输入目标价格"></lay-input>
        </lay-form-item>
        <lay-form-item label="上涨空间" prop="upside">
          <lay-input v-model.number="model11.upside" placeholder="请输入上涨空间百分比"></lay-input>
        </lay-form-item>
        <lay-form-item label="退出时间" prop="exite_time">
          <lay-input v-model="model11.exite_time" type="datetime-local"></lay-input>
        </lay-form-item>
        <lay-form-item label="附加信息" prop="out_info">
          <lay-textarea v-model="model11.out_info" :rows="3"></lay-textarea>
        </lay-form-item>
        <div style="width: 100%; text-align: center">
          <lay-button size="sm" type="primary" @click="toSubmit" :disabled="isSaving">
            <span v-if="!isSaving">保存</span>
            <span v-else>正在保存...</span>
          </lay-button>
          <lay-button size="sm" @click="toCancel">取消</lay-button>
        </div>
      </lay-form>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { getAiStockPickers, getAiStockPickerById, createAiStockPicker, updateAiStockPicker, deleteAiStockPicker } from '../../../api/module/aiStockPicker'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 定义AI股票选股接口，与后端数据结构匹配
interface AiStockPicker {
  id: string;
  trader_uuid?: string;
  userid?: string;
  market: string;
  symbols: string;
  put_price: number;
  put_time?: string;
  currprice?: number;
  exite_time?: string;
  target_price?: number;
  upside?: number;
  out_info?: string;
}

// 搜索条件
const searchQuery = ref({
  symbols: '',
  market: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 20, total: 0 })
const dataSource = ref<AiStockPicker[]>([])

// 表格列配置
const columns = ref([
  {
    title: 'ID',
    key: 'id',
    width: 300,
    fixed: 'left',
  },
  {
    title: '股票代码',
    key: 'symbols',
  },
  {
    title: '交易市场',
    key:'market',
    slot: 'market',
   
  },
  {
    title: '推荐价格',
    key: 'put_price',
   
  },
  {
    title: '推荐时间',
    key: 'put_time',
   
    sortable: true
  },
  // {
  //   title: '当前价格',
  //   key: 'currprice',
  
  // },
  {
    title: '目标价格',
    key: 'target_price',
   
  },
  {
    title: '上涨空间(%)',
    key: 'upside',
   
  },
  
])

// 新增/编辑弹窗
const visible11 = ref(false)
const title11 = ref('')
const model11 = ref({
  market: 'US',
  symbols: '',
  put_price: 0,
  put_time: new Date().toISOString().slice(0, 16),
  currprice: 0,
  exite_time: '',
  target_price: 0,
  upside: 0,
  out_info: ''
})
const formRef = ref()

// 保存状态
const isSaving = ref(false)

// 初始化数据
onMounted(() => {
  loadData()
})

// 加载数据
async function loadData() {
  loading.value = true
  try {
    // 后端API使用offset和limit，而不是page
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.symbols
    }
    
    // 添加market筛选条件（如果有值）
    if (searchQuery.value.market) {
      params.market = searchQuery.value.market
    }
    
    const response = await getAiStockPickers(params)
    dataSource.value = (response.data || []).map((item: any) => formatDatesForDisplay(item, ['put_time']))
    page.total = response.total || 0
  } catch (error) {
    console.error('加载数据失败:', error)
    layer.msg('加载数据失败', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 查询
function toSearch() {
  page.current = 1
  loadData()
}

// 重置
function toReset() {
  searchQuery.value = {
    symbols: '',
    market: ''
  }
  toSearch()
}

// 改变页码
function change(data: any) {
  page.current = data.current
  page.limit = data.limit
  loadData()
}

// 排序
function sortChange(data: any) {
  console.log('排序:', data)
  // 这里可以根据需要实现排序功能
}

// 打开新增/编辑弹窗
function changeVisible11(type: string, row?: AiStockPicker) {
  title11.value = type
  if (type === '新增') {
   model11.value= {
      market: 'US',
      symbols: '',
      put_price: 0,
      put_time: new Date().toISOString().slice(0, 16),
      currprice: 0,
      exite_time: '',
      target_price: 0,
      upside: 0,
      out_info: ''
    }
  } else {
    // 处理日期格式，将后端可能的完整日期格式转换为datetime-local格式
    const formattedRow = {
      ...row,
      put_time: row?.put_time ? new Date(row.put_time).toISOString().slice(0, 16) : '',
      exite_time: row?.exite_time ? new Date(row.exite_time).toISOString().slice(0, 16) : ''
    }
    Object.assign(model11, formattedRow)
  }
  visible11.value = true
}

// 保存
async function toSubmit() {
  // 防止重复提交
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    // 输入验证
    if (!model11.market || !model11.symbols || model11.put_price === undefined || model11.put_price === null) {
      layer.msg('请填写必填字段：交易市场、股票代码和买入价格', { icon: 3 })
      isSaving.value = false
      return
    }
    
    // 构建提交数据，确保字段名与后端匹配
    const submitData = {
      market: model11.market,
      symbols: model11.symbols,
      put_price: model11.put_price,
      put_time: model11.put_time ? new Date(model11.put_time).toISOString() : new Date().toISOString(),
      currprice: model11.currprice,
      exite_time: model11.exite_time ? new Date(model11.exite_time).toISOString() : undefined,
      target_price: model11.target_price,
      upside: model11.upside,
      out_info: model11.out_info
    }
    
    if (title11.value === '新增') {
      await createAiStockPicker(submitData)
    } else {
      await updateAiStockPicker(model11.id!, submitData)
    }
    layer.msg(title11.value + '成功', { icon: 1 })
    visible11.value = false
    loadData()
  } catch (error) {
    console.error(title11.value + '失败:', error)
    layer.msg(title11.value + '失败', { icon: 2 })
  } finally {
    isSaving.value = false
  }
}

// 取消
function toCancel() {
  visible11.value = false
}

// 删除单个
async function deleteItem(id: string) {
  layer.confirm('确定要删除这条数据吗？', async () => {
    try {
      await deleteAiStockPicker(id)
      layer.msg('删除成功', { icon: 1 })
      loadData()
    } catch (error) {
      console.error('删除失败:', error)
      layer.msg('删除失败', { icon: 2 })
    }
  })
}

// 批量删除
async function toRemove() {
  if (selectedKeys.value.length === 0) {
    layer.msg('请选择要删除的数据', { icon: 3 })
    return
  }
  layer.confirm('确定要删除选中的' + selectedKeys.value.length + '条数据吗？', async () => {
    try {
      for (const id of selectedKeys.value) {
        await deleteAiStockPicker(id)
      }
      layer.msg('删除成功', { icon: 1 })
      selectedKeys.value = []
      loadData()
    } catch (error) {
      console.error('删除失败:', error)
      layer.msg('删除失败', { icon: 2 })
    }
  })
}
</script>
<style lang="less" scoped>
.ai-stock-picker-box {
  height: 100%;
  overflow: hidden;
  background-color: #f2f2f2;
  padding: 10px;
}

.search-input {
  display: inline-block;
  width: 98%;
  margin-right: 10px;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: calc(100% - 50px);
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>