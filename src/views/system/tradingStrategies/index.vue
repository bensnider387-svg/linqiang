<template>
  <lay-container fluid="true" class="trading-strategies-box">
    <lay-card>
      <lay-form style="margin-top: 10px">
        <lay-row>
          <lay-col :md="6">
            <lay-form-item label="搜索关键词" label-width="80">
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
            <lay-form-item label="策略类型" label-width="80">
              <lay-select
                class="search-input"
                size="sm"
                v-model="searchQuery.stype"
                :allow-clear="true"
                placeholder="请选择"
              >
                <lay-select-option value="0" label="默认类型"></lay-select-option>
                <lay-select-option value="1" label="类型一"></lay-select-option>
                <lay-select-option value="2" label="类型二"></lay-select-option>
                <lay-select-option value="3" label="类型三"></lay-select-option>
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
        <template v-slot:operator="{ row }">
          <lay-button
            size="xs"
            type="primary"
            @click="changeVisible11('编辑', row)"
            >编辑</lay-button
          >
          <lay-popconfirm
            content="确定要删除此交易策略吗?"
            @confirm="confirm(row)"
            @cancel="cancel"
          >
            <lay-button size="xs" border="red" border-style="dashed"
              >删除</lay-button
            >
          </lay-popconfirm>
        </template>
        <template v-slot:market_analysis="{ row }">
          <div class="content-preview" @click="showFullContent('市场分析', row.market_analysis)">{{ row.market_analysis.substring(0, 50) }}{{ row.market_analysis.length > 50 ? '...' : '' }}</div>
        </template>
        <template v-slot:trading_focus="{ row }">
          <div class="content-preview" @click="showFullContent('分享重点', formatTradingFocusPreview(row.trading_focus))">{{ formatTradingFocusPreview(row.trading_focus).substring(0, 50) }}{{ formatTradingFocusPreview(row.trading_focus).length > 50 ? '...' : '' }}</div>
        </template>
        <template v-slot:risk_warning="{ row }">
          <div class="content-preview" @click="showFullContent('风险提示', row.risk_warning)">{{ row.risk_warning.substring(0, 50) }}{{ row.risk_warning.length > 50 ? '...' : '' }}</div>
        </template>
        <template v-slot:stype="{ row }">
          {{ getStrategyTypeLabel(row.stype) }}
        </template>
          <template v-slot:warntype="{ row }">
          {{ getStrategyTypeLabel(row.warntype) }}
        </template>
        <template v-slot:updated_at="{ row }">
          <span>{{ formatUSDate(row.updated_at) }}</span>
        </template>
      </lay-table>
    </div>

    <lay-layer v-model="visible11" :title="title" :area="['920px', '900px']">
      <div style="padding: 20px">
        <lay-form :model="model11" :pane="true" ref="layFormRef11" required>
          <lay-form-item label="市场分析" prop="market_analysis">
            <div class="textarea-tip">段落之间按回车换行即可，前台会自动分段并首行空两格。</div>
            <lay-textarea v-model="model11.market_analysis" placeholder="请输入市场分析，每段结束后按回车开始下一段" rows="8"></lay-textarea>
          </lay-form-item>
          <lay-form-item label="分析文件类型" prop="stype" :label-width="140">
            <lay-select v-model="model11.stype" placeholder="请选择策略类型">
             <lay-select-option :value="1" label="音频"></lay-select-option>
              <lay-select-option :value="2" label="视频"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="分析文件路径" prop="analysis_path" mode="inline" :label-width="140">
            <lay-input v-model="model11.analysis_path" placeholder="分析文件地址" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUploadAnalysisFile"
            :url="uploadvideosUrl"
            v-model="analysisFile"
            field="file"
            :auto="true"
            @done="handleAnalysisFileUploadSuccess"
            mode="inline"
          />
          <lay-form-item label="分享重点" prop="trading_focus_items" :label-width="140">
            <div class="trading-focus-tip">
              以下内容均为分享建议，供用户参考理解，不代表实际成交或下单指令。
            </div>
            <div v-for="(item, index) in model11.trading_focus_items" :key="index" class="trading-focus-item">
              <div class="trading-focus-fields">
                <div class="trading-focus-field">
                  <label>分享股票代码</label>
                  <lay-input v-model="item.symbol" placeholder="如 TNXP"></lay-input>
                </div>
                <div class="trading-focus-field">
                  <label>建议关注时间</label>
                  <lay-date-picker
                    v-model="item.buy_time"
                    type="datetime"
                    placeholder="请选择建议关注时间"
                    :allow-clear="true"
                  ></lay-date-picker>
                </div>
                <div class="trading-focus-field">
                  <label>建议买入价</label>
                  <lay-input v-model="item.buy_price" placeholder="如 21.00（仅供参考）"></lay-input>
                </div>
                <div class="trading-focus-field">
                  <label>建议仓位比例</label>
                  <lay-select v-model="item.position" placeholder="请选择建议仓位比例">
                    <lay-select-option
                      v-for="option in positionOptions"
                      :key="option"
                      :value="option"
                      :label="option"
                    ></lay-select-option>
                  </lay-select>
                </div>
              </div>
              <lay-button size="sm" @click="removeTradingFocusItem(index)" border="red" border-style="dashed">
                删除
              </lay-button>
            </div>
            <lay-button type="primary" size="sm" @click="addTradingFocusItem">
              <lay-icon class="layui-icon-addition"></lay-icon>
              添加一行
            </lay-button>
          </lay-form-item>
          <lay-form-item label="风险提示" prop="risk_warning">
            <div class="textarea-tip">段落之间按回车换行即可，前台会自动分段并首行空两格。</div>
            <lay-textarea v-model="model11.risk_warning" placeholder="请输入风险提示，每段结束后按回车开始下一段" rows="8"></lay-textarea>
          </lay-form-item>
          
          
          <lay-form-item label="警告文件类型" prop="warntype" :label-width="140">
            <lay-select v-model="model11.warntype" placeholder="请选择警告类型">
              <lay-select-option :value="1" label="音频"></lay-select-option>
              <lay-select-option :value="2" label="视频"></lay-select-option>
            </lay-select>
          </lay-form-item>
          <lay-form-item label="警告文件路径" prop="warn_path" mode="inline" :label-width="140">
            <lay-input v-model="model11.warn_path" placeholder="警告文件地址" :readonly="true"></lay-input>
          </lay-form-item>
          <lay-upload
            :beforeUpload="beforeUploadWarnFile"
            :url="uploadvideosUrl"
            v-model="warnFile"
            field="file"
            :auto="true"
            @done="handleWarnFileUploadSuccess"
            mode="inline"
          />
         
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
import { getTradingStrategies, createTradingStrategy, updateTradingStrategy, deleteTradingStrategy } from '../../../api/module/tradingStrategies'
import {
  createEmptyTradingFocusItem,
  formatTradingFocusPreview,
  formatBuyTime,
  normalizePosition,
  parseTradingFocusItems,
  POSITION_OPTIONS,
  type TradingFocusItem
} from '@/utils/parseTradingFocus'
import { formatUSDate } from '@/utils/dateFormat'
const uploadvideosUrl=import.meta.env.VITE_API_URL?import.meta.env.VITE_API_URL+"/api/upload/videos":"https://houduan-api.onrender.com/api/upload/videos"
const positionOptions = POSITION_OPTIONS
// 定义交易策略接口
interface TradingStrategy {
  id: number;
  market_analysis: string;
  trading_focus: any;
  risk_warning: string;
  trader_uuid?: string;
  stype: number;
  analysis_path?: string;
  warntype: number;
  warn_path?: string;
  updated_at?: string;
}

// 搜索条件
const searchQuery = ref({
  search: '',
  stype: ''
})

// 分页信息
const loading = ref(false)
const selectedKeys = ref<string[]>([])
const page = reactive({ current: 1, limit: 10, total: 0 })
const dataSource = ref<TradingStrategy[]>([])

// 表格列配置
const columns = ref([
 
  { title: 'ID', width: '80px', key: 'id' },
  { title: '市场分析', width: '200px', key: 'market_analysis', customSlot: 'market_analysis' },
  { title: '分享重点', width: '200px', key: 'trading_focus', customSlot: 'trading_focus' },
  { title: '风险提示', width: '200px', key: 'risk_warning', customSlot: 'risk_warning' },
  { title: '分析附件类型', width: '100px', key: 'stype', customSlot: 'stype' },
  { title: '分析路径', width: '150px', key: 'analysis_path' },
  { title: '警告附件类型', width: '100px', key: 'warntype', customSlot: 'warntype' },
  { title: '警告路径', width: '150px', key: 'warn_path' },
  { title: '最后更新', width: '150px', key: 'updated_at', customSlot: 'updated_at' },
  { title: '操作', width: '120px', customSlot: 'operator', key: 'operator', fixed: 'right' }
])

// 对话框相关
const model11 = ref<any>({ 
  id: 0,
  market_analysis: '',
  trading_focus: '{}',
  trading_focus_items: [createEmptyTradingFocusItem()], // 交易重点列表
  risk_warning: '',
  stype: 0,
  analysis_path: '',
  warntype: 0,
  warn_path: '',
  file_type: 'audio',
  file_url: ''
})
const layFormRef11 = ref()
const visible11 = ref(false)
const title = ref('新增')
// 文件上传相关
const file = ref<any>([])
const uploading = ref(false)
// 分析文件上传相关
const analysisFile = ref<any>([])
const uploadingAnalysis = ref(false)
// 警告文件上传相关
const warnFile = ref<any>([])
const uploadingWarn = ref(false)


// 初始化加载数据
onMounted(() => {
  change(page)
})

// 重置搜索条件
function toReset() {
  searchQuery.value = {
    search: '',
    stype: ''
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
      stype: searchQuery.value.stype
    }
    
    // 调用API获取交易策略列表
    const response = await getTradingStrategies(params)
    
    // 确保response对象存在并有正确的格式
    if (response && response.success) {
      // 转换数据格式以适应表格
      dataSource.value = response.data && Array.isArray(response.data) 
        ? response.data.map((item: any) => ({ ...item })) 
        : []
      
      // 处理分页逻辑
      page.total = response.total || 0;
    } else {
      layer.msg(response?.message || '获取交易策略列表失败', { icon: 2 })
    }
  } catch (error) {
    console.error('获取交易策略列表异常:', error)
    layer.msg('获取交易策略列表异常', { icon: 2 })
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
            // 批量删除交易策略
            const results = [];
            let hasError = false;
            
            for (const strategyId of selectedKeys.value) {
              try {
                const response = await deleteTradingStrategy(Number(strategyId));
                results.push(response);
                if (!response.success) {
                  hasError = true;
                }
              } catch (error) {
                console.error(`删除策略ID ${strategyId} 异常:`, error);
                hasError = true;
              }
            }
            
            if (hasError) {
              layer.msg('部分删除失败，请重试', { icon: 2 });
            } else {
              layer.msg('删除成功', { icon: 1 });
              // 刷新数据
              change(page);
              // 清空选择
              selectedKeys.value = [];
            }
          } catch (error) {
            console.error('删除交易策略异常:', error);
            layer.msg('删除失败', { icon: 2 });
          } finally {
            loading.value = false;
            layer.close(id);
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
const changeVisible11 = (text: string, row?: TradingStrategy) => {
  title.value = text
  if (row) {
    // 编辑模式，复制行数据
    model11.value = {
      ...row,
      trading_focus: typeof row.trading_focus === 'string' ? row.trading_focus : JSON.stringify(row.trading_focus),
      trading_focus_items: parseTradingFocusItems(row.trading_focus),
      file_type: row.file_type || 'audio',
      file_url: row.file_url || ''
    }
    console.log(model11.value)
  } else {
    // 新增模式，清空表单
    model11.value = {
      id: 0,
      market_analysis: '',
      trading_focus: '{}',
      trading_focus_items: [createEmptyTradingFocusItem()], // 初始化一个空行
      risk_warning: '',
      stype: 0,
      analysis_path: '',
      warntype: 0,
      warn_path: '',
      file_type: 'audio',
      file_url: ''
    }
  }
  visible11.value = true
}



// 添加交易重点行
function addTradingFocusItem() {
  model11.value.trading_focus_items.push(createEmptyTradingFocusItem());
}

// 删除交易重点行
function removeTradingFocusItem(index: number) {
  if (model11.value.trading_focus_items.length > 1) {
    model11.value.trading_focus_items.splice(index, 1);
  } else {
    layer.msg('至少保留一行分享重点', { icon: 3 });
  }
}

// 提交表单
async function toSubmit() {
  try {
    // 表单验证
    if (!model11.value.market_analysis) {
      layer.msg('市场分析不能为空', { icon: 3 });
      loading.value = false;
      return;
    }
    const validFocusItems = (model11.value.trading_focus_items as TradingFocusItem[]).filter((item) =>
      item.symbol?.trim() ||
      formatBuyTime(item.buy_time) ||
      item.buy_price?.trim() ||
      normalizePosition(item.position)
    );

    if (validFocusItems.length === 0) {
      layer.msg('请至少填写一条分享重点', { icon: 3 });
      loading.value = false;
      return;
    }

    const invalidItem = validFocusItems.find((item) => !item.symbol?.trim());
    if (invalidItem) {
      layer.msg('每条分享重点都需要填写分享股票代码', { icon: 3 });
      loading.value = false;
      return;
    }
    if (!model11.value.risk_warning) {
      layer.msg('风险提示不能为空', { icon: 3 });
      loading.value = false;
      return;
    }
    
    // 创建提交数据对象
    const submitData = {
      market_analysis: model11.value.market_analysis,
      trading_focus: validFocusItems.map((item) => ({
        symbol: item.symbol.trim(),
        buy_time: formatBuyTime(item.buy_time),
        buy_price: item.buy_price.trim(),
        position: normalizePosition(item.position),
      })),
      risk_warning: model11.value.risk_warning,
      stype: model11.value.stype,
      analysis_path: model11.value.analysis_path,
      warntype: model11.value.warntype,
      warn_path: model11.value.warn_path,
      file_type: model11.value.file_type,
      file_url: model11.value.file_url
    };
    
    if (model11.value.id) {
      // 编辑交易策略
      const response = await updateTradingStrategy(model11.value.id, submitData);
      loading.value = false;
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
      // 新增交易策略
      const response = await createTradingStrategy(submitData);
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
    loading.value = false;
  }
}

// 关闭对话框
function toCancel() {
  visible11.value = false
}

// 确认删除单个交易策略
  async function confirm(data: TradingStrategy) {
    loading.value = true
    try {
      const response = await deleteTradingStrategy(data.id);
      if (response.success) {
        layer.msg(response.message || '删除成功', { icon: 1 });
        // 刷新数据
        change(page);
        // 清空选择
        selectedKeys.value = [];
      } else {
        layer.msg(response.message || '删除失败', { icon: 2 });
      }
    } catch (error) {
      console.error('删除交易策略异常:', error);
      layer.msg('删除交易策略异常', { icon: 2 });
    } finally {
      loading.value = false
    }
  }

// 取消删除
function cancel() {
  layer.msg('您已取消操作')
}

// 获取策略类型标签
function getStrategyTypeLabel(type: number): string {
  const typeMap: {[key: number]: string} = {
  
    1: '音频',
    2: '视频'
  
  };
  return typeMap[type] || `未知类型(${type})`;
}

// 显示完整内容
function showFullContent(title: string, content: string) {
  layer.open({
    type: 1,
    title: title,
    area: ['600px', '400px'],
    content: `<div style="padding: 20px; max-height: 340px; overflow-y: auto;">${content}</div>`
  });
}

// 文件上传前校验
const beforeUploadFile = (file: File) => {
  layer.load(0, {time: 5000})
  var isOver = false
  if (file.size > 100 * 1024 * 1024) { // 100MB限制
    isOver = true
    layer.msg(`文件大小超过100MB`, { icon: 2 })
    layer.closeAll()
    return new Promise((resolver) => resolver(false))
  }
  
  // 根据选择的文件类型检查文件格式
  const fileType = model11.value.file_type || 'audio';
  let validTypes: string[] = [];
  
  if (fileType === 'audio') {
    validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac'];
  } else if (fileType === 'video') {
    validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  }
  
  if (!validTypes.includes(file.type)) {
    layer.msg(`不支持的文件类型: ${file.type}`, { icon: 2 });
    layer.closeAll()
    return new Promise((resolver) => resolver(false));
  }
  
  // 设置上传中状态
  uploading.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理文件上传成功后的回调
function handleFileUploadSuccess(response: any) {
  layer.closeAll()
  uploading.value = false;
  layer.closeAll('loading'); // 关闭上传提示
  try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      // 将上传成功后的文件URL赋值给file_url字段
      model11.value.file_url = updataData.data.url;
      layer.msg('文件上传成功', { icon: 1 });
    } else {
      layer.msg('文件上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('文件上传失败，请重试', { icon: 2 });
  }
}

// 分析文件上传前校验
const beforeUploadAnalysisFile = (file: File) => {
  var isOver = false
  if (file.size > 100 * 1024 * 1024) { // 100MB限制
    isOver = true
    layer.msg(`文件大小超过100MB`, { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }
  
  // 根据选择的文件类型检查文件格式
  const fileType = model11.value.stype || 'audio';
  let validTypes: string[] = [];
  
  if (fileType === 'audio') {
    validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac'];
  } else if (fileType === 'video') {
    validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  }
  
  if (!validTypes.includes(file.type)) {
    layer.msg(`不支持的文件类型: ${file.type}`, { icon: 2 });
    return new Promise((resolver) => resolver(false));
  }
  
  // 设置上传中状态
  uploadingAnalysis.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理分析文件上传成功后的回调
function handleAnalysisFileUploadSuccess(response: any) {
  uploadingAnalysis.value = false;
  layer.closeAll('loading'); // 关闭上传提示
  try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      // 将上传成功后的文件URL赋值给analysis_path字段
      model11.value.analysis_path = updataData.data.url;
      layer.msg('分析文件上传成功', { icon: 1 });
    } else {
      layer.msg('分析文件上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('分析文件上传失败，请重试', { icon: 2 });
  }
}

// 警告文件上传前校验
const beforeUploadWarnFile = (file: File) => {
  var isOver = false
  if (file.size > 100 * 1024 * 1024) { // 100MB限制
    isOver = true
    layer.msg(`文件大小超过100MB`, { icon: 2 })
    return new Promise((resolver) => resolver(false))
  }
  
  // 根据选择的文件类型检查文件格式
  const fileType = model11.value.warntype || 'audio';
  let validTypes: string[] = [];
  
  if (fileType === 'audio') {
    validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/flac'];
  } else if (fileType === 'video') {
    validTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv', 'video/webm'];
  }
  
  if (!validTypes.includes(file.type)) {
    layer.msg(`不支持的文件类型: ${file.type}`, { icon: 2 });
    return new Promise((resolver) => resolver(false));
  }
  
  // 设置上传中状态
  uploadingWarn.value = true;
  layer.load(2, { shade: [0.3, '#fff'] });
  return new Promise((resolver) => resolver(true))
}

// 处理警告文件上传成功后的回调
function handleWarnFileUploadSuccess(response: any) {
  uploadingWarn.value = false;
  layer.closeAll('loading'); // 关闭上传提示
  try {
    let updataData = typeof response.data === 'string' ? JSON.parse(response.data) : response.data;
    if (updataData && updataData.success) {
      // 将上传成功后的文件URL赋值给warn_path字段
      model11.value.warn_path = updataData.data.url;
      layer.msg('警告文件上传成功', { icon: 1 });
    } else {
      layer.msg('警告文件上传失败', { icon: 2 });
    }
  } catch (error) {
    console.error('解析上传响应异常:', error);
    layer.msg('警告文件上传失败，请重试', { icon: 2 });
  }
}
</script>

<style scoped>
.trading-strategies-box {
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

.content-preview {
  cursor: pointer;
  color: #1890ff;
}

.content-preview:hover {
  text-decoration: underline;
}

.trading-focus-tip,
.textarea-tip {
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f0f7ff;
  border: 1px solid #cfe3ff;
  color: #4b5563;
  font-size: 12px;
  line-height: 1.6;
}

.trading-focus-item {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 12px;
  padding: 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.trading-focus-item:hover {
  background-color: #e9ecef;
}

.trading-focus-fields {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
  flex: 1;
}

.trading-focus-field label {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  color: #666;
}

.trading-focus-field :deep(.layui-input),
.trading-focus-field :deep(.layui-select),
.trading-focus-field :deep(.layui-date-picker) {
  width: 100%;
}

.layui-icon-addition {
  margin-right: 5px;
}
</style>