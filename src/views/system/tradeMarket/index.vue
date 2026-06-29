<template>
  <lay-container fluid="true" class="trade-market-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="市场名称" label-width="80">
              <lay-input
                v-model="searchQuery.search"
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
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此交易市场吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['750px', '450px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="市场名称" prop="marketname">
            <lay-input v-model="model11.marketname" placeholder="请输入市场名称"></lay-input>
          </lay-form-item>
          <lay-form-item label="货币类型" prop="currency">
            <lay-input v-model="model11.currency" placeholder="请输入货币类型"></lay-input>
          </lay-form-item>
          <lay-form-item label="汇率" prop="exchange_rate">
            <lay-input v-model="model11.exchange_rate" placeholder="请输入汇率"></lay-input>
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
import { getTradeMarkets, createTradeMarket, updateTradeMarket, deleteTradeMarket } from '../../../api/module/tradeMarket'
import { formatUSDate } from '@/utils/dateFormat'

// 定义交易市场接口
interface TradeMarket {
  id: number;
  marketname: string;
  currency: string;
  exchange_rate: string;
  created_at?: string;
}

// 搜索条件
const searchQuery = ref({ search: '' })

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<TradeMarket[]>([])

// 表格列配置
const columns = ref([
 
  { title: 'ID', width: '80px', key: 'id' },
  { title: '市场名称', width: '200px', key: 'marketname', sort: 'desc' },
  { title: '货币类型', width: '150px', key: 'currency' },
  { title: '汇率', width: '150px', key: 'exchange_rate' },
  { title: '创建时间', width: '180px', key: 'created_at' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({
  id: 0,
  marketname: '',
  currency: '',
  exchange_rate: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增交易市场')

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = { search: '' }
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
    // 构建请求参数
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.search
    }
    
    // 调用API获取交易市场列表
    const { data, success, total } = await getTradeMarkets(params)
    if (success) {
      // 转换数据格式以适应表格
      dataSource.value = data.map((item: any) => ({
        ...item,
        // 确保ID是数字类型
        id: Number(item.id),
        // 确保汇率是字符串类型
        exchange_rate: item.exchange_rate?.toString() || '',
        // 格式化日期时间
        created_at: item.created_at ? formatUSDate(item.created_at) : ''
      }))
      
      page.total = total || 0;
    } else {
      layer.msg('获取交易市场列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取交易市场列表异常:', error)
    layer.msg('获取交易市场列表异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}

// 打开对话框
const changeVisible11 = (type: string, row?: TradeMarket) => {
  title.value = type
  if (type === '新增') {
    model11.value = {
      id: 0,
      marketname: '',
      currency: '',
      exchange_rate: ''
    }
  } else if (type === '编辑' && row) {
    model11.value = {
      ...row
    }
  }
  visible11.value = true
}

// 提交表单
const toSubmit = async () => {
  
  try {
    // 表单验证
    if (!model11.value.marketname) {
      layer.msg('请输入市场名称', { icon: 2 })
      loading.value = false
      return
    }
    
    if (!model11.value.currency) {
      layer.msg('请输入货币类型', { icon: 2 })
      loading.value = false
      return
    }
    
    // 准备提交数据
    const submitData = {
      marketname: model11.value.marketname,
      currency: model11.value.currency,
      exchange_rate: model11.value.exchange_rate || ''
    }
    
    let response
    if (model11.value.id > 0) {
      // 更新交易市场
      response = await updateTradeMarket(model11.value.id, submitData)
    } else {
      // 新增交易市场
      response = await createTradeMarket(submitData)
    }
    
    if (response.success) {
      layer.msg(response.message || (model11.value.id > 0 ? '更新成功' : '新增成功'), { icon: 1 })
      visible11.value = false
      // 刷新数据
      loading.value = true
      change(page)
    } else {
      layer.msg(response.message || (model11.value.id > 0 ? '更新失败' : '新增失败'), { icon: 2 })
    }
  } catch (error) {
    console.error('提交表单异常:', error)
    layer.msg('操作异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 关闭对话框
function toCancel() {
  visible11.value = false
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
            // 批量删除交易市场
            for (const marketId of selectedKeys.value) {
              const response = await deleteTradeMarket(Number(marketId))
              if (!response.success) {
                throw new Error(response.message || '删除失败')
              }
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            loading.value = true
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除交易市场异常:', error)
            layer.msg('删除失败: ' + (error as Error).message, { icon: 2 })
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

// 确认删除单个交易市场
async function confirm(data: TradeMarket) {
  
  try {
    const response = await deleteTradeMarket(data.id)
    if (response.success) {
      layer.msg('删除成功', { icon: 1 })
      // 刷新数据
      loading.value = true
      change(page)
      // 清空选择
      selectedKeys.value = []
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 })
    }
  } catch (error) {
    console.error('删除交易市场异常:', error)
    layer.msg('删除交易市场异常: ' + (error as Error).message, { icon: 2 })
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
.trade-market-box {
  padding: 16px;
}

.table-box {
  margin-top: 10px;
  padding: 10px;
  height: calc(100vh - 200px);
  width: 100%;
  border-radius: 4px;
  box-sizing: border-box;
  background-color: #fff;
}
</style>