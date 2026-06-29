<template>
  <lay-container fluid="true" class="payment-records-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="用户名" label-width="80">
              <lay-input
                v-model="searchQuery.username"
                placeholder="请输入用户名"
                size="sm"
                :allow-clear="true"
                style="width: 98%"
              ></lay-input>
            </lay-form-item>
          </lay-col>
          <lay-col :md="6">
            <lay-form-item label="支付状态" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.status"
                :allow-clear="true"
                placeholder="请选择状态"
              >
                <lay-select-option value="待审核" label="待审核"></lay-select-option>
                <lay-select-option value="已通过" label="已通过"></lay-select-option>
                <lay-select-option value="已拒绝" label="已拒绝"></lay-select-option>
              </lay-select>
            </lay-form-item>
          </lay-col>
         
          <lay-col :md="6">
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
       
        <template v-slot:status="{ row }">
          <lay-tag :type="getStatusType(row.status)">{{ row.status }}</lay-tag>
        </template>
        <template v-slot:amount="{ row }">
          <span style="color: #ff5722; font-weight: bold">{{ row.amount }}</span>
        </template>
        <template v-slot:payment_screenshot="{ row }">
          <img 
            v-if="row.payment_screenshot" 
            :src="row.payment_screenshot" 
            style="width: 50px; height: 50px; cursor: pointer; object-fit: cover; border-radius: 4px;"
            @click="previewImage(row.payment_screenshot)"
            alt="支付截图"
          />
          <span v-else>暂无截图</span>
        </template>
        <template v-slot:operator="{ row }">
          
          <lay-button
            v-if="row.status === '待审核'"
            size="xs"
            type="normal"
            @click="reviewPayment(row)"
            >审核</lay-button
          >
         
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['650px', '500px']">
      <div style="padding: 20px">
        <lay-form :model="model11" ref="layFormRef11" required>
          <lay-form-item label="用户ID" prop="user_id" v-if="!model11.id">
            <lay-input v-model="model11.user_id" placeholder="请输入用户ID"></lay-input>
          </lay-form-item>
          <lay-form-item label="支付金额" prop="amount">
            <lay-input-number 
              v-model="model11.amount" 
              placeholder="请输入支付金额"
              :min="0"
              :step="0.01"
              :precision="2"
            ></lay-input-number>
          </lay-form-item>
          <lay-form-item label="VIP等级" prop="vip_level_name">
            <lay-select v-model="model11.vip_level_name" placeholder="请选择VIP等级">
              <lay-select-option value="VIP1" label="VIP1"></lay-select-option>
              <lay-select-option value="VIP2" label="VIP2"></lay-select-option>
              <lay-select-option value="VIP3" label="VIP3"></lay-select-option>
              <lay-select-option value="VIP4" label="VIP4"></lay-select-option>
              <lay-select-option value="VIP5" label="VIP5"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="支付截图" prop="payment_screenshot" mode="inline">
            <lay-input v-model="model11.payment_screenshot" placeholder="支付截图地址" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUploadImage"
            :url="uploadImageUrl"
            v-model="imageFile"
            field="file"
            :auto="true"
            @done="handleImageUploadSuccess"
            mode="inline"
          />
          <lay-form-item label="支付备注" prop="payment_remark">
            <lay-textarea v-model="model11.payment_remark" placeholder="请输入支付备注"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="支付状态" prop="status" v-if="model11.id">
            <lay-select v-model="model11.status" placeholder="请选择状态">
              <lay-select-option value="待审核" label="待审核"></lay-select-option>
              <lay-select-option value="已通过" label="已通过"></lay-select-option>
              <lay-select-option value="已拒绝" label="已拒绝"></lay-select-option>
            </lay-select>
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

    <lay-layer v-model="visibleReview" title="支付审核" :area="['400px', '300px']">
      <div style="padding: 20px">
        <lay-form :model="reviewModel" ref="reviewFormRef" required>
          <lay-form-item label="审核结果" prop="status">
            <lay-radio-group v-model="reviewModel.status">
              <lay-radio value="已通过">通过</lay-radio>
              <lay-radio value="已拒绝">拒绝</lay-radio>
            </lay-radio-group>
          </lay-form-item>
          <lay-form-item label="审核备注" prop="review_remark">
            <lay-textarea v-model="reviewModel.review_remark" placeholder="请输入审核备注"></lay-textarea>
          </lay-form-item>
        </lay-form>
        <div style="width: 100%; text-align: right; margin-top: 20px">
          <lay-button size="sm" type="primary" @click="submitReview" :disabled="isReviewing">
            <span v-if="!isReviewing">提交审核</span>
            <span v-else>审核中...</span>
          </lay-button>
          <lay-button size="sm" @click="cancelReview">取消</lay-button>
        </div>
      </div>
    </lay-layer>

    <lay-layer v-model="visibleImagePreview" title="图片预览" :area="['600px', '400px']">
      <div style="padding: 20px; text-align: center">
        <img 
          :src="previewImageUrl" 
          style="max-width: 100%; max-height: 100%; object-fit: contain;"
          alt="预览图片"
        />
      </div>
    </lay-layer>
  </lay-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { layer } from '@layui/layui-vue'
import { 
  getPaymentRecords, 
  createPaymentRecord, 
  updatePaymentRecord, 
  deletePaymentRecord,
  reviewPaymentRecord
} from '../../../api/module/paymentRecords'
import { formatDatesForDisplay } from '@/utils/dateFormat'

const uploadImageUrl = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL + "/api/upload/images" 
  : "https://houduan-api.onrender.com/api/upload/images"

// 定义支付记录接口
interface PaymentRecord {
  id: number;
  user_id: number;
  username: string;
  email: string;
  amount: number;
  vip_level_name: string;
  payment_screenshot: string;
  payment_remark: string;
  status: string;
  payment_time: string;
  review_time: string;
  review_remark: string;
}

// 搜索条件
const searchQuery = ref({
  username: '',
  status: '',
  vip_level_name: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<PaymentRecord[]>([])

// 表格列配置
const columns = ref([
  { title: 'ID', width: '280px', key: 'id' },
  { title: '用户名', width: '120px', key: 'username', sort: 'desc' },
  { title: '邮箱', width: '180px', key: 'email' },
  { title: '支付金额', width: '100px', key: 'amount', customSlot: 'amount' },
  { title: 'VIP等级', width: '100px', key: 'vip_level_name' },
  { title: '支付截图', width: '100px', key: 'payment_screenshot', customSlot: 'payment_screenshot' },
  { title: '支付状态', width: '100px', key: 'status', customSlot: 'status' },
  { title: '支付时间', width: '150px', key: 'payment_time' },
  { title: '审核时间', width: '150px', key: 'review_time' },
  { title: '操作', width: '180px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  user_id: '',
  amount: 0,
  vip_level_name: '',
  payment_screenshot: '',
  payment_remark: '',
  status: '待审核'
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')

// 审核相关
const visibleReview = ref(false)
const reviewFormRef = ref()
const reviewModel = ref({
  id: 0,
  status: '已通过',
  review_remark: ''
})
const isReviewing = ref(false)

// 图片上传相关
const imageFile = ref<any>([])
const uploading = ref(false)

// 图片预览
const visibleImagePreview = ref(false)
const previewImageUrl = ref('')

// 保存状态
const isSaving = ref(false)

// 初始化加载数据
onMounted(() => {
  change(page)
})

// 获取状态标签类型
function getStatusType(status: string): string {
  switch (status) {
    case '待审核': return 'warning'
    case '已通过': return 'success'
    case '已拒绝': return 'danger'
    default: return 'normal'
  }
}

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    username: '',
    status: '',
    vip_level_name: ''
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
      username: searchQuery.value.username,
      status: searchQuery.value.status,
      vip_level_name: searchQuery.value.vip_level_name
    }
    
    const { data, success, total } = await getPaymentRecords(params)
    if (success) {
      dataSource.value = (data || []).map((item: any) => formatDatesForDisplay(item, ['payment_time', 'review_time']))
      page.total = total || 0;
    } else {
      layer.msg('获取支付记录列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取支付记录列表异常:', error)
    layer.msg('获取支付记录列表异常', { icon: 2 })
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
          loading.value = true
          try {
            for (const recordId of selectedKeys.value) {
              await deletePaymentRecord(Number(recordId))
            }
            layer.msg('删除成功', { icon: 1 })
            change(page)
            selectedKeys.value = []
          } catch (error) {
            console.error('删除支付记录异常:', error)
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
const changeVisible11 = (text: string, row?: PaymentRecord) => {
  title.value = text
  if (row) {
    model11.value = { ...row }
  } else {
    model11.value = {
      id: 0,
      user_id: '',
      amount: 0,
      vip_level_name: '',
      payment_screenshot: '',
      payment_remark: '',
      status: '待审核'
    }
  }
  visible11.value = true
}

// 提交表单
async function toSubmit() {
  if (isSaving.value) {
    return;
  }
  
  isSaving.value = true;
  
  try {
    if (uploading.value) {
      layer.msg('文件正在上传中，请稍候再试', { icon: 3 });
      isSaving.value = false;
      return;
    }
   
    if (!model11.value.user_id && !model11.value.id) {
      layer.msg('用户ID不能为空', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.amount || model11.value.amount <= 0) {
      layer.msg('支付金额必须大于0', { icon: 3 });
      isSaving.value = false;
      return;
    }
    if (!model11.value.vip_level_name) {
      layer.msg('请选择VIP等级', { icon: 3 });
      isSaving.value = false;
      return;
    }
    
    const submitData = {
      user_id: model11.value.user_id,
      amount: model11.value.amount,
      vip_level_name: model11.value.vip_level_name,
      payment_screenshot: model11.value.payment_screenshot,
      payment_remark: model11.value.payment_remark,
      status: model11.value.status
    };
    
    if (model11.value.id) {
      const response = await updatePaymentRecord(model11.value.id, submitData);
      if (response.success) {
        layer.msg(response.message || '更新成功', { icon: 1 });
        visible11.value = false;
        toReset();
        change(page);
      } else {
        layer.msg(response.message || '更新失败', { icon: 2 });
      }
    } else {
      const response = await createPaymentRecord(submitData);
      if (response.success) {
        layer.msg(response.message || '新增成功', { icon: 1 });
        visible11.value = false;
        toReset();
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
  uploading.value = false;
  imageFile.value = null;
  toReset();
  visible11.value = false;
}

// 确认删除单个记录
async function confirm(data: PaymentRecord) {
  loading.value = true
  try {
    const response = await deletePaymentRecord(data.id);
    if (response.success) {
      layer.msg('删除成功', { icon: 1 });
      change(page);
      selectedKeys.value = [];
    } else {
      layer.msg(response.message || '删除失败', { icon: 2 });
    }
  } catch (error) {
    console.error('删除支付记录异常:', error);
    layer.msg('删除支付记录异常', { icon: 2 });
  } finally {
    loading.value = false
  }
}

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 图片上传前校验
const beforeUploadImage = (file: File) => {
  layer.load(0, {time: 3000})
  
  if (file.size > 5 * 1024 * 1024) { // 5MB限制
    layer.msg(`文件大小超过5MB`, { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  if (!validTypes.includes(file.type)) {
    layer.msg(`不支持的文件类型: ${file.type}`, { icon: 2 });
    return new Promise((resolver) => resolver(false));
  }
  
  uploading.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理图片上传成功后的回调
function handleImageUploadSuccess(response: any) {
  layer.closeAll()
  uploading.value = false;
  
  setTimeout(() => {
    uploading.value = false;
  }, 100);
  
  try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      model11.value.payment_screenshot = updataData.data.url;
      layer.msg('图片上传成功', { icon: 1 });
      imageFile.value = null;
    } else {
      layer.msg('图片上传失败', { icon: 2 });
      imageFile.value = null;
      uploading.value = false;
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('图片上传失败，请重试', { icon: 2 });
    imageFile.value = null;
    uploading.value = false;
  }
}

// 预览图片
function previewImage(url: string) {
  previewImageUrl.value = url;
  visibleImagePreview.value = true;
}

// 审核支付记录
function reviewPayment(row: PaymentRecord) {
  reviewModel.value = {
    id: row.id,
    status: '已通过',
    review_remark: ''
  };
  visibleReview.value = true;
}

// 提交审核
async function submitReview() {
  if (isReviewing.value) {
    return;
  }
  
  isReviewing.value = true;
  
  try {
    const response = await reviewPaymentRecord(reviewModel.value.id, {
      status: reviewModel.value.status,
      review_remark: reviewModel.value.review_remark
    });
    
    if (response.success) {
      layer.msg('审核成功', { icon: 1 });
      visibleReview.value = false;
      change(page);
    } else {
      layer.msg(response.message || '审核失败', { icon: 2 });
    }
  } catch (error) {
    console.error('审核异常:', error);
    layer.msg('审核异常', { icon: 2 });
  } finally {
    isReviewing.value = false;
  }
}

// 取消审核
function cancelReview() {
  visibleReview.value = false;
  reviewModel.value = {
    id: 0,
    status: '已通过',
    review_remark: ''
  };
}
</script>

<style scoped>
.payment-records-box {
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

.isChecked {
  display: inline-block;
  background-color: #e8f1ff;
  color: red;
}
</style>