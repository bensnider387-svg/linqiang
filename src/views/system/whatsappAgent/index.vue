<template>
  <lay-container fluid="true" class="whatsapp-agent-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="搜索" label-width="80">
              <lay-input
                v-model="searchQuery.search"
                placeholder="请输入名称或电话号码"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="5">
            <lay-form-item label="状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.is_active"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="true" label="启用"></lay-select-option>
                <lay-select-option value="false" label="禁用"></lay-select-option>
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
        @sort-change="sortChange"
      >
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button
          >
       
        </template>
        <template v-slot:status="{ row }">
          <lay-switch v-model="row.is_active" :checked="row.is_active" @change="changeStatus($event, row)"></lay-switch>
        </template>
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此WhatsApp代理吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['550px', '400px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="代理名称" prop="name">
            <lay-input v-model="model11.name" placeholder="请输入代理名称"></lay-input>
          </lay-form-item>
          <lay-form-item label="电话号码" prop="phone_number">
            <lay-input v-model="model11.phone_number" placeholder="请输入电话号码"></lay-input>
          </lay-form-item>
          <lay-form-item label="是否启用" prop="is_active">
            <lay-switch v-model="model11.is_active" :checked="model11.is_active"></lay-switch>
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
import { getWhatsappAgents, createWhatsappAgent, updateWhatsappAgent, deleteWhatsappAgent } from '../../../api/module/whatsappAgents'
import { formatDatesForDisplay } from '@/utils/dateFormat'

// 定义WhatsApp代理接口
interface WhatsAppAgent {
  id: number;
  name: string;
  phone_number: string;
  is_active: boolean;
  created_at: string;
  trader_uuid?: string;
}

// 搜索条件
const searchQuery = ref({
  search: '',
  is_active: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<WhatsAppAgent[]>([])

// 表格列配置
const columns = ref([

  { title: 'ID', width: '80px', key: 'id' },
  { title: '代理名称', width: '200px', key: 'name' },
  { title: '电话号码', width: '150px', key: 'phone_number' },
  { title: '是否启用', width: '100px', key: 'is_active', customSlot: 'status' },
  { title: '创建时间', width: '150px', key: 'created_at' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({
  id: 0,
  name: '',
  phone_number: '',
  is_active: true
})
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
    search: '',
    is_active: ''
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
    // 构建请求参数
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      search: searchQuery.value.search,
      is_active: searchQuery.value.is_active
    }
    
    // 调用API获取WhatsApp代理列表
    const { data, success, total } = await getWhatsappAgents(params)
    if (success) {
      dataSource.value = (data || []).map((item: any) => formatDatesForDisplay(item, ['created_at']))
      page.total = total || 0;
    } else {
      layer.msg('获取WhatsApp代理列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取WhatsApp代理列表异常:', error)
    layer.msg('获取WhatsApp代理列表异常', { icon: 2 })
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

// 修改WhatsApp代理状态
const changeStatus = async (isChecked: boolean, row: WhatsAppAgent) => {
  try {
    const response = await updateWhatsappAgent(row.id, { is_active: isChecked })
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
      // 刷新数据
      change(page);
    } else {
      layer.msg(response.message || '状态更新失败', { icon: 2 })
      // 恢复原始状态
      const index = dataSource.value.findIndex(item => item.id === row.id)
      if (index !== -1) {
        dataSource.value[index].is_active = !isChecked
      }
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
    // 恢复原始状态
    const index = dataSource.value.findIndex(item => item.id === row.id)
    if (index !== -1) {
      dataSource.value[index].is_active = !isChecked
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
          loading.value = true
          try {
            // 批量删除WhatsApp代理
            for (const agentId of selectedKeys.value) {
              await deleteWhatsappAgent(Number(agentId))
            }
            layer.msg('删除成功', { icon: 1 })
            // 刷新数据
            change(page)
            // 清空选择
            selectedKeys.value = []
          } catch (error) {
            console.error('删除WhatsApp代理异常:', error)
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
const changeVisible11 = (text: string, row?: WhatsAppAgent) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = { ...row }
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      name: '',
      phone_number: '',
      is_active: true
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
    if (!model11.value.name) {
      layer.msg('代理名称不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.phone_number) {
      layer.msg('电话号码不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      name: model11.value.name,
      phone_number: model11.value.phone_number,
      is_active: model11.value.is_active
    };
    
    if (model11.value.id) {
      // 编辑WhatsApp代理
      const response = await updateWhatsappAgent(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        // 刷新数据
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增WhatsApp代理
      const response = await createWhatsappAgent(submitData);
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

// 确认删除单个WhatsApp代理
async function confirm(data: WhatsAppAgent) {
  loading.value = true
  try {
    const response = await deleteWhatsappAgent(data.id);
    if (response.success) {
      layer.msg('删除成功', { icon: 1 });
      // 刷新数据
      change(page);
      // 清空选择
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除WhatsApp代理异常:', error);
    layer.msg('删除WhatsApp代理异常', { icon: 2 });
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
.whatsapp-agent-box {
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