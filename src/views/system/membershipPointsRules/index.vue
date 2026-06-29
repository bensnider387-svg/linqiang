<template>
  <lay-container fluid="true" class="membership-points-rules-box">
   
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
            content="确定要删除此积分规则吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['700px', '500px']">
      <div style="padding: 20px">
        <lay-form ref="layFormRef11" :model="model11">
          <lay-form-item label="交易员UUID" prop="trader_uuid" :label-width="120">
            <lay-input v-model="model11.trader_uuid" placeholder="请输入交易员UUID"></lay-input>
          </lay-form-item>
          <lay-form-item label="注册积分" prop="register_points" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.register_points" placeholder="请输入注册积分"></lay-input>
          </lay-form-item>
          <lay-form-item label="点赞积分" prop="likes_points" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.likes_points" placeholder="请输入点赞积分"></lay-input>
          </lay-form-item>
          <lay-form-item label="上传交易积分" prop="upload_trades_points" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.upload_trades_points" placeholder="请输入上传交易积分"></lay-input>
          </lay-form-item>
          <lay-form-item label="AI推荐消费积分" prop="ai_recommended_consumption" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.ai_recommended_consumption" placeholder="请输入AI推荐消费积分"></lay-input>
          </lay-form-item>
          <lay-form-item label="AI诊断消费积分" prop="ai_diagnostic_consumption" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.ai_diagnostic_consumption" placeholder="请输入AI诊断消费积分"></lay-input>
          </lay-form-item>
          <lay-form-item label="答题赠送积分(大于60%)" prop="answer_questions" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.answer_questions" placeholder="请输入答题赠送积分(60%)"></lay-input>
          </lay-form-item>
          <lay-form-item label="答题消耗积分" prop="answering_consumption" :label-width="120" mode="inline">
            <lay-input type="number" v-model="model11.answering_consumption" placeholder="请输入答题消耗积分(60%)"></lay-input>
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
import { getMembershipPointsRules, createMembershipPointsRule, updateMembershipPointsRule, deleteMembershipPointsRule } from '../../../api/module/membershipPointsRules'
import { useUserStore } from '@/store'

// 定义会员积分规则接口
interface MembershipPointsRule {
  id: number;
  trader_uuid: string;
  register_points: number;
  likes_points: number;
  upload_trades_points: number;
  ai_recommended_consumption: number;
  ai_diagnostic_consumption: number;
  answer_questions:number;
  answering_consumption:number
}

// 表格列配置
const columns = ref([
  
  { key: 'trader_uuid', title: '交易员UUID', width: 180 },
  { key: 'register_points', title: '注册积分', width: 120 },
  { key: 'likes_points', title: '点赞积分', width: 120 },
  { key: 'upload_trades_points', title: '上传交易(多少$1分)', width: 120 },
  { key: 'ai_recommended_consumption', title: 'AI推荐消费积分', width: 140 },
  { key: 'ai_diagnostic_consumption', title: 'AI诊断消费积分', width: 140 },
  { key: 'answer_questions', title: '答题赠送积分(60%)', width: 140 },
  { key: 'answering_consumption', title: '答题消耗积分', width: 140 },
  { key: 'operator', title: '操作', width: 120, customSlot: 'operator', fixed: 'right' }
])

const userStore = useUserStore()
// 搜索条件
const searchQuery = ref({ 
  search: ''
})

// 分页配置
const page = ref({
  current: 1,
  limit: 10,
  total: 0
})

// 数据源
const dataSource = ref<MembershipPointsRule[]>([])

// 加载状态
const loading = ref(false)

// 选中的行
const selectedKeys = ref<string[]>([])

// 对话框相关
const model11 = ref<any>({})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 保存状态
const isSaving = ref(false)

// 初始化加载数据
onMounted(() => {
 change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    search: ''
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
        search: searchQuery.value.search
      }
      
      // 调用API获取会员积分规则列表
      const response = await getMembershipPointsRules(params)
      console.log('Membership Points Rules Response:', response);
      
      // 确保response数据格式正确
      if (response.success) {
        // 更新数据源
        if (Array.isArray(response.data)) {
          dataSource.value = response.data || []
          page.value.total = response.data.length || 0
        } else if (response.data && Array.isArray(response.data.items)) {
          dataSource.value = response.data.items || []
          page.value.total = response.data.total || 0
        } else if (response.data) {
          dataSource.value = response.data || []
          page.value.total = response.total || 0
        } else {
          console.error('Invalid response format:', response);
          dataSource.value = []
          page.value.total = 0
        }
        if(dataSource.value.length<=0)
        {
          dataSource.value.push({
            id: 0,
            trader_uuid: userStore.userInfo.trader_uuid,
            register_points: 100,
            likes_points: 10,
            upload_trades_points: 10,
            ai_recommended_consumption: 10,
            ai_diagnostic_consumption: 5,
          })
        }
      } else {
        layer.msg('获取数据失败', { icon: 2 })
      }
    } catch (error) {
    console.error('获取会员积分规则列表异常:', error)
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
    layer.msg('请选择要删除的积分规则', { icon: 3 })
    return
  }
  
  layer.confirm('确定要删除选中的' + selectedKeys.value.length + '个积分规则吗？', {
    icon: 3,
    title: '确认删除'
  }, async (index: number) => {
    
    try {
      // 遍历删除选中的积分规则
      for (const id of selectedKeys.value) {
        await deleteMembershipPointsRule(id)
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
    await deleteMembershipPointsRule(id)
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



// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: MembershipPointsRule) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      trader_uuid: '',
      register_points: 0,
      likes_points: 0,
      upload_trades_points: 1000,
      ai_recommended_consumption: 0,
      ai_diagnostic_consumption: 0,
      answer_questions: 0,
      answering_consumption: 0,
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
    if (!model11.value.trader_uuid) {
      layer.msg('交易员UUID不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 验证所有积分值都为非负数
    const pointsFields = ['register_points', 'likes_points', 'upload_trades_points', 'ai_recommended_consumption', 'ai_diagnostic_consumption'];
    for (const field of pointsFields) {
      if (model11.value[field] === undefined || model11.value[field] < 0) {
        layer.msg(`${field}必须大于等于0`, { icon: 3 });
        isSaving.value = false;
        return;
      }
    }
    
    // 创建提交数据对象，确保与后端接口匹配
    const submitData = { ...model11.value };
    
    // 转换积分值为整数
    for (const field of pointsFields) {
      if (submitData[field] !== undefined) {
        submitData[field] = parseInt(submitData[field]);
      }
    }
    
    loading.value = true;
    
    // 如果是编辑模式
    if (model11.value.id!=0) {
      // 编辑积分规则
      const response = await updateMembershipPointsRule(model11.value.id, submitData);
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
      // 新增积分规则
      const response = await createMembershipPointsRule(submitData);
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
  } finally {
    isSaving.value = false;
  }
}

// 关闭对话框
function toCancel() {
  visible11.value = false
}
</script>

<style scoped>
.membership-points-rules-box {
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