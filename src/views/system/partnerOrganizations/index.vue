<template>
  <lay-container fluid="true" class="partner-organizations-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="5">
            <lay-form-item label="单位名称" label-width="80">
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
        @sortChange="sortChange"
      >
        <template #logo_url="{ row }">
          <lay-avatar :src="row.logo_url" v-if="row.logo_url" size="md"></lay-avatar>
          <span v-else style="color: #999;">未设置</span>
        </template>
        <template #is_active="{ row }">
          <lay-switch
            :model-value="row.is_active === true || row.is_active === 'true'"
            @change="changeStatus($event, row, 'is_active')"
          ></lay-switch>
        </template>
        <template #is_vip="{ row }">
          <lay-switch
            :model-value="row.is_vip === true || row.is_vip === 'true'"
            @change="changeStatus($event, row, 'is_vip')"
          ></lay-switch>
        </template>
        <template #website_url="{ row }">
          <a :href="row.website_url" target="_blank" v-if="row.website_url" style="color: #1890ff;">
            {{ row.website_url }}
          </a>
          <span v-else style="color: #999;">未设置</span>
        </template>
        <template v-slot:toolbar>
          <lay-button size="sm" type="primary" @click="changeVisible11('新增')">
            <lay-icon class="layui-icon-addition"></lay-icon>
            新增</lay-button
          >
          <lay-button size="sm" type="normal" @click="showTitleDialog" style="margin-left: 10px;">
            <lay-icon class="layui-icon-edit"></lay-icon>
            设置标题</lay-button
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
            content="确定要删除此合作单位吗?"
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

    <lay-layer v-model="visible11" :title="title" :area="['700px', '600px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
          <lay-form-item label="单位名称" prop="name" :label-width="160">
            <lay-input v-model="model11.name" placeholder="例如：中国工商银行"></lay-input>
          </lay-form-item>
          <lay-form-item label="Logo图片" prop="logo_url" :label-width="160">
            <lay-input v-model="model11.logo_url" placeholder="Logo图片URL（上传后自动填充）" :readonly="true" style="margin-bottom: 10px;"></lay-input>
            <lay-upload
              :beforeUpload="beforeUploadImage"
              :url="uploadImagesUrl"
              v-model="logoFile"
              field="file"
              :auto="true"
              @done="handleUploadSuccess"
              mode="inline"
            />
            <div v-if="model11.logo_url" style="margin-top: 10px;">
              <img :src="model11.logo_url" alt="Logo预览" style="max-width: 100px; max-height: 100px; border: 1px solid #ddd; padding: 5px; border-radius: 4px;" @error="handleImageError" />
            </div>
          </lay-form-item>
          <lay-form-item label="跳转网址" prop="website_url" :label-width="160">
            <lay-input v-model="model11.website_url" placeholder="例如：https://www.icbc.com.cn"></lay-input>
          </lay-form-item>
          <lay-form-item label="显示顺序" prop="display_order" :label-width="160">
            <lay-input v-model="model11.display_order" type="number" placeholder="数字越小越靠前"></lay-input>
          </lay-form-item>
          <lay-form-item label="状态" prop="is_active" mode="inline" :label-width="160">
            <lay-switch v-model="model11.is_active" :onswitch-value="true" :unswitch-value="false"></lay-switch>
          </lay-form-item>
          <lay-form-item label="VIP显示" prop="is_vip" mode="inline" :label-width="160">
            <lay-switch v-model="model11.is_vip" :onswitch-value="true" :unswitch-value="false"></lay-switch>
            <span style="margin-left: 10px; color: #999; font-size: 12px;">开启后将在VIP页面显示</span>
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

    <!-- 标题设置对话框 -->
    <lay-layer v-model="titleDialogVisible" title="设置标题" :area="['500px', '250px']">
      <div style="padding: 20px">
        <lay-form :model="titleForm" :pane="true" ref="titleFormRef" required>
          <lay-form-item label="区块标题" prop="section_title" :label-width="120">
            <lay-input v-model="titleForm.section_title" placeholder="e.g. Partner Institutions, Partners"></lay-input>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right; margin-top: 20px">
          <lay-button size="sm" type="primary" @click="saveTitle" :disabled="isSavingTitle">
            <span v-if="!isSavingTitle">保存</span>
            <span v-else>正在保存...</span>
          </lay-button>
          <lay-button size="sm" @click="titleDialogVisible = false">取消</lay-button>
        </div>
      </div>
    </lay-layer>
  </lay-container>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { 
  getPartnerOrganizationsAdmin, 
  createPartnerOrganization, 
  updatePartnerOrganization, 
  deletePartnerOrganization,
  updateSectionTitle,
  type PartnerOrganization 
} from '../../../api/module/partnerOrganizations'
import { formatDatesForDisplay } from '@/utils/dateFormat'
import { DEFAULT_PARTNER_SECTION_TITLE, normalizePartnerSectionTitle } from '@/utils/partnerOrganizations'

// 上传相关
const logoFile = ref<any>(null)
const uploadImagesUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL + "/api/upload/images" 
  : "https://houduan-api.onrender.com/api/upload/images"

// 搜索条件
const searchQuery = ref({
  name: '',
  is_active: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 100 })
const dataSource = ref<PartnerOrganization[]>([])

// 表格列配置
const columns = ref([
  { title: 'Logo', width: '100px', key: 'logo_url', customSlot: 'logo_url' },
  { title: '单位名称', width: '200px', key: 'name' },
  { title: '跳转网址', width: '250px', key: 'website_url', customSlot: 'website_url' },
  { title: '显示顺序', width: '100px', key: 'display_order' },
  { title: '状态', width: '80px', key: 'is_active', customSlot: 'is_active' },
  { title: 'VIP显示', width: '100px', key: 'is_vip', customSlot: 'is_vip' },
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

// 标题设置相关
const titleDialogVisible = ref(false)
const titleForm = ref({ section_title: DEFAULT_PARTNER_SECTION_TITLE })
const titleFormRef = ref()
const isSavingTitle = ref(false)
const currentSectionTitle = ref(DEFAULT_PARTNER_SECTION_TITLE)

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    name: '',
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
  if (page) {
    page.current = page.current || 1;
    page.limit = page.limit || 10;
  }

  loading.value = true
  try {
    const params = {
      limit: page.limit,
      offset: (page.current - 1) * page.limit,
      query: searchQuery.value.name,
      is_active: searchQuery.value.is_active
    }
    
    const response = await getPartnerOrganizationsAdmin(params)
    if (response.success) {
      dataSource.value = (response.data || []).map((item: any) => formatDatesForDisplay(item, ['created_at']))
      page.total = response.total || 0;
      // 获取当前标题
      if (response.section_title) {
        const normalizedTitle = normalizePartnerSectionTitle(response.section_title)
        currentSectionTitle.value = normalizedTitle
        titleForm.value.section_title = normalizedTitle
      }
    } else {
      layer.msg('获取合作单位列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取合作单位列表异常:', error)
    layer.msg('获取合作单位列表异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 排序
const sortChange = (key: any, sort: number) => {
  layer.msg(`字段${key} - 排序${sort}, 你可以利用 sort-change 实现服务端排序`)
}

// 修改状态
const changeStatus = async (isChecked: boolean, row: PartnerOrganization, key: any) => {
  try {
    const para: any = {}
    para[key] = isChecked
    const response = await updatePartnerOrganization(row.id, para)
    if (response.success) {
      layer.msg('状态更新成功', { icon: 1 })
      loading.value = true
      change(page)
    } else {
      layer.msg(response.message || '状态更新失败', { icon: 2 })
    }
  } catch (error) {
    console.error('状态更新异常:', error)
    layer.msg('状态更新异常', { icon: 2 })
  } finally {
    loading.value = false
  }
}

// 确认删除
function confirmDelete(id: number) {
  try {
    deletePartnerOrganization(id).then(() => {
      layer.msg('删除成功', { icon: 1 })
      loading.value = true
      change(page)
    }).catch(() => {
      layer.msg('删除失败', { icon: 2 })
    }).finally(() => {
      loading.value = false
    })
  } catch (error) {
    console.error('删除合作单位异常:', error)
    layer.msg('删除异常', { icon: 2 })
    loading.value = false
  }
}

// 打开新增/编辑对话框
const changeVisible11 = (text: string, row?: PartnerOrganization) => {
  title.value = text
  // 重置上传文件
  logoFile.value = null
  if (row) {
    // 编辑模式
    model11.value = { ...row }
  } else {
    // 新增模式
    model11.value = {
      name: '',
      logo_url: '',
      website_url: '',
      display_order: 0,
      is_active: true,
      is_vip: false
    }
  }
  visible11.value = true
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.style.display = 'none';
}

// 图片上传前校验
const beforeUploadImage = (file: File) => {
  layer.load(0, { time: 3000 })
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
    let uploadData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (uploadData && uploadData.success) {
      // 将上传成功后的图片URL赋值给logo_url字段
      model11.value.logo_url = uploadData.data.url;
      layer.msg('上传成功', { icon: 1 });
    } else {
      layer.msg('上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('上传失败，请重试', { icon: 2 });
  }
}

// 提交表单
async function toSubmit() {
  if (isSaving.value) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    // 表单验证
    if (!model11.value.name) {
      layer.msg('单位名称不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    const submitData = { ...model11.value };
    
    // 转换布尔值
    if (typeof submitData.is_active === 'string') {
      submitData.is_active = submitData.is_active === 'true';
    }
    if (typeof submitData.is_vip === 'string') {
      submitData.is_vip = submitData.is_vip === 'true';
    }
    
    // 转换数字
    if (submitData.display_order !== undefined) {
      submitData.display_order = parseInt(submitData.display_order) || 0;
    }
    
    if (model11.value.id) {
      // 编辑
      const response = await updatePartnerOrganization(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      // 新增
      const response = await createPartnerOrganization(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
        loading.value = true;
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

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 显示标题设置对话框
const showTitleDialog = () => {
  titleForm.value.section_title = currentSectionTitle.value
  titleDialogVisible.value = true
}

// 保存标题
async function saveTitle() {
  if (isSavingTitle.value) {
    return
  }
  
  if (!titleForm.value.section_title || titleForm.value.section_title.trim() === '') {
    layer.msg('标题不能为空', { icon: 3 })
    return
  }
  
  isSavingTitle.value = true
  try {
    const response = await updateSectionTitle(titleForm.value.section_title.trim())
    if (response.success) {
      layer.msg('标题更新成功', { icon: 1 })
      currentSectionTitle.value = titleForm.value.section_title.trim()
      titleDialogVisible.value = false
      // 刷新数据以获取最新标题
      change(page)
    } else {
      layer.msg(response.message || '标题更新失败', { icon: 2 })
    }
  } catch (error) {
    console.error('保存标题异常:', error)
    layer.msg('保存标题异常', { icon: 2 })
  } finally {
    isSavingTitle.value = false
  }
}
</script>

<style scoped>
.partner-organizations-box {
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

