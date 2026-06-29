<template>
  <lay-container fluid="true" class="membership-level-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="等级名称" label-width="80">
              <lay-input
                v-model="searchQuery.name"
                placeholder="请输入"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="等级" label-width="80">
              <lay-input
                v-model="searchQuery.level"
                placeholder="请输入"
                size="sm"
                type="number"
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
        @sortChange="sortChange"
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
            content="确定要删除此会员等级吗?"
            @confirm="confirmDelete(row.id)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['600px', '720px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" :label-width="160" ref="layFormRef11" required>
          <lay-form-item label="等级" prop="level">
            <lay-input v-model="model11.level" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="等级名称" prop="name">
            <lay-input v-model="model11.name"></lay-input>
          </lay-form-item>
          <lay-form-item label="会员权益" prop="benefits">
            <div class="benefits-container">
              <div v-for="(benefit, index) in benefitsList" :key="index" class="benefit-item">
                <lay-input v-model="benefitsList[index]" :placeholder="`权益 ${index + 1}`"></lay-input>
                <lay-button size="sm" type="danger" @click="removeBenefit(index)" v-if="benefitsList.length > 1">删除</lay-button>
              </div>
              <lay-button size="sm" type="primary" @click="addBenefit">添加权益</lay-button>
            </div>
          </lay-form-item>
          <lay-form-item label="最低交易量" prop="min_trading_volume">
            <lay-input v-model="model11.min_trading_volume" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="月收益率(%)" prop="monthly_profit_ratio">
            <lay-input v-model="model11.monthly_profit_ratio" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="佣金比例(%)" prop="commission_ratio">
            <lay-input v-model="model11.commission_ratio" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="风险比例(%)" prop="risk_ratio">
            <lay-input v-model="model11.risk_ratio" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="补偿比例(%)" prop="compensation_ratio">
            <lay-input v-model="model11.compensation_ratio" type="number"></lay-input>
          </lay-form-item>
          <lay-form-item label="VIP价格" prop="vip_price">
            <lay-input v-model="model11.vip_price" type="number"></lay-input>
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
import { getMembershipLevels, createMembershipLevel, updateMembershipLevel, deleteMembershipLevel } from '../../../api/module/membershipLevels'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 定义会员等级接口
interface MembershipLevel {
  id: number;
  level: number;
  name: string;
  benefits: string;
  min_trading_volume: number;
  trader_uuid?: string;
  monthly_profit_ratio: number;
  commission_ratio: number;
  risk_ratio: number;
  compensation_ratio: number;
  vip_price: number;
  created_at: string;
}

// 搜索条件
const searchQuery = ref({
  name: '',
  level: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<MembershipLevel[]>([])

// 表格列配置
const columns = ref([

  { title: 'ID', width: '80px', key: 'id' },
  { title: '等级', width: '80px', key: 'level', sort: 'asc' },
  { title: '等级名称', width: '150px', key: 'name' },
  { title: '会员权益', width: '200px', key: 'benefits' },
  { title: '最低交易量', width: '100px', key: 'min_trading_volume' },
  { title: '月收益率(%)', width: '100px', key: 'monthly_profit_ratio' },
  { title: '佣金比例(%)', width: '100px', key: 'commission_ratio' },
  { title: '风险比例(%)', width: '100px', key: 'risk_ratio' },
  { title: '补偿比例(%)', width: '100px', key: 'compensation_ratio' },
  { title: 'VIP价格', width: '100px', key: 'vip_price' },
  { title: '创建时间', width: '150px', key: 'created_at' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 保存状态
const isSaving = ref(false)

// 会员权益列表
const benefitsList = ref<string[]>([''])

// 添加权益
const addBenefit = () => {
  benefitsList.value.push('')
}

// 删除权益
const removeBenefit = (index: number) => {
  benefitsList.value.splice(index, 1)
}

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    name: '',
    level: ''
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
      search: searchQuery.value.name,
      level: searchQuery.value.level,
      page: page.current
    }
    
    // 调用API获取会员等级列表
    const result = await getMembershipLevels(params)
    if (result && result.data) {
      dataSource.value = (result.data || []).map((item: any) => formatDatesForDisplay(item, ['created_at']))
      page.total = result.total || 0;
    } else {
      layer.msg('获取会员等级列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取会员等级列表异常:', error)
    layer.msg('获取会员等级列表异常', { icon: 2 })
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
            // 批量删除会员等级
            for (const levelId of selectedKeys.value) {
              const result = await deleteMembershipLevel(levelId)
              if (result.error && result.error.includes('有用户正在使用该会员等级')) {
                layer.msg(result.error, { icon: 2 })
                loading.value = false
                layer.close(id)
                return
              }
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除会员等级异常:', error)
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

// 确认删除单个会员等级
function confirmDelete(id: string) {
 
  try {
    deleteMembershipLevel(id).then(() => {
      layer.msg('删除成功', { icon: 1 })
      // 刷新数据
      change(page)
    }).catch((error: any) => {
      layer.msg(error.response?.data?.error || '删除失败', { icon: 2 })
    }).finally(() => {
      loading.value = false
    })
  } catch (error) {
    console.error('删除会员等级异常:', error)
    layer.msg('删除异常', { icon: 2 })
    loading.value = false
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: MembershipLevel) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
    // 将逗号分隔的权益转换为数组
    if (model11.value.benefits) {
      benefitsList.value = model11.value.benefits.split(',').filter(b => b.trim());
    } else {
      benefitsList.value = [''];
    }
  } else {
    // 新增模式，清空表单
    model11.value = {
      level: 1,
      name: '',
      benefits: '',
      min_trading_volume: 0,
      monthly_profit_ratio: 0,
      commission_ratio: 0,
      risk_ratio: 0,
      compensation_ratio: 0,
      vip_price: 0
    }
    benefitsList.value = [''];
  }
  visible11.value = true
}

// 提交表单
async function toSubmit() {
  // 防止重复提交
  if (isSaving.value) return
  isSaving.value = true
  
  try {
    // 表单验证
    if (!model11.value.level || !model11.value.name) {
      layer.msg('等级和等级名称不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 处理会员权益：将数组转换为逗号分隔
    const processedBenefits = benefitsList.value
      .filter(benefit => benefit.trim())
      .join(',');
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = {
      level: model11.value.level,
      name: model11.value.name,
      benefits: processedBenefits,
      min_trading_volume: model11.value.min_trading_volume,
      monthly_profit_ratio: model11.value.monthly_profit_ratio,
      commission_ratio: model11.value.commission_ratio,
      risk_ratio: model11.value.risk_ratio,
      compensation_ratio: model11.value.compensation_ratio,
      vip_price: model11.value.vip_price
    };
    
    if (model11.value.id) {
      // 编辑会员等级
      try {
        const result = await updateMembershipLevel(model11.value.id, submitData);
        if (result) {
          layer.msg('更新成功', { icon: 1 });
          visible11.value = false;
          
          // 刷新数据
          change(page);
        } else {
          layer.msg('更新失败', { icon: 2 });
        }
      } catch (error) {
        layer.msg(error.response?.data?.error || '更新失败', { icon: 2 });
      }
    } else {
      // 新增会员等级
      try {
        const result = await createMembershipLevel(submitData);
        if (result) {
          layer.msg('新增成功', { icon: 1 });
          visible11.value = false;
          // 刷新数据
          change(page);
        } else {
          layer.msg('新增失败', { icon: 2 });
        }
      } catch (error) {
        layer.msg(error.response?.data?.error || '新增失败', { icon: 2 });
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
</script>

<style scoped>
.membership-level-box {
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

.benefits-container {
  width: 100%;
}

.benefit-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  gap: 10px;
}

.benefit-item .lay-input {
  flex: 1;
}
</style>