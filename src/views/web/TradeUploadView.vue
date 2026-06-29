<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <navcomponent></navcomponent>

    <!-- 上传交易记录容器 -->
    <div class="login-container">
      <div class="login-header">
        <div class="avatar">📊</div>
        <h1>Upload Trade Record</h1>
        <p>Submit your trading activity for analysis</p>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="Trade_market">Market</label>
          <select id="Trade_market" v-model="market" required :disabled="isLoadingMarkets">
           
            <option v-if="isLoadingMarkets" disabled>Loading markets...</option>
            <option v-for="item in marketList" :key="item.id" :value="item.marketname">{{ item.marketname }}</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="symbol">Symbol</label>
          <input type="text" id="symbol" v-model="symbol" placeholder="e.g. AAPL" required>
          <div v-if="symbolError" class="error-message">{{ symbolError }}</div>
        </div>
        
        <div class="form-group">
          <label for="entry_price">Entry Price</label>
          <input type="number" id="entry_price" v-model.number="entryPrice" placeholder="Enter entry price" required step="0.01">
          <div v-if="entryPriceError" class="error-message">{{ entryPriceError }}</div>
        </div>
        
        <div class="form-group">
          <label for="size">Size</label>
          <input type="number" id="size" v-model.number="quantity" placeholder="Enter size" required step="0.01">
          <div v-if="quantityError" class="error-message">{{ quantityError }}</div>
        </div>
        
        <div class="form-group">
          <label for="entry_date">Entry Date</label>
          <input type="date" id="entry_date" v-model="selectedDate" required>
          <div v-if="entryDateError" class="error-message">{{ entryDateError }}</div>
        </div>
        
        <div class="form-group">
          <label for="asset_type">Asset Type</label>
          <select id="asset_type" v-model="assetType" required>
            <option value="">--Please select--</option>
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
            <option value="forex">Forex</option>
            <option value="fund">Fund</option>
          </select>
          <div v-if="assetTypeError" class="error-message">{{ assetTypeError }}</div>
        </div>
        
        <div class="form-group">
          <label for="direction">Direction</label>
          <select id="direction" v-model="direction" required>
            <option value="">--Please select--</option>
            <option value="1">Long</option>
            <option value="-1">Short</option>
          </select>
          <div v-if="directionError" class="error-message">{{ directionError }}</div>
        </div>
        <button type="submit" class="login-btn" :disabled="isSaving" v-if="!isSaving">Submit</button>
         <button type="submit" class="login-btn" :disabled="isSaving" v-else>Submitting...</button>
      </form>
      
      <div class="back-link">
        <router-link to="/vipdashboard">Back to Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue';
import { createVipTrade } from '../../api/module/web/vip';
import { uploadImage } from '../../api/module/commone';
import { get_market_list } from '../../api/module/web/vip';

const router = useRouter();

// 表单数据
const market = ref('');
const direction = ref('');
const symbol = ref('');
const entryPrice = ref<number>(0);
const quantity = ref<number>(0);
// 获取美国东部日期
const getUSDate = () => {
  const now = new Date();
  const usTime = new Date(now.toLocaleString("en-US", {timeZone: "America/New_York"}));
  
  const year = usTime.getFullYear();
  const month = String(usTime.getMonth() + 1).padStart(2, '0');
  const day = String(usTime.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

const selectedDate = ref(getUSDate());
const assetType = ref('');
const tradeType = ref('');
const tradeFile = ref<File | null>(null);
const selectedFileName = ref('');
const fileUrl = ref('');
const isUploading = ref(false);
const isSaving = ref(false);
// 市场列表数据
const marketList = ref<any[]>([]);
const isLoadingMarkets = ref(false);

// 错误消息
const symbolError = ref('');
const entryPriceError = ref('');
const quantityError = ref('');
const entryDateError = ref('');
const assetTypeError = ref('');
const directionError = ref('');
const tradeImageError = ref('');

// 移除图片函数
const removeImage = () => {
  fileUrl.value = '';
  tradeFile.value = null;
  selectedFileName.value = '';
  tradeImageError.value = '';
};

// 获取市场列表
const fetchMarketList = async () => {
  isLoadingMarkets.value = true;
  try {
    const response = await get_market_list();
    if (response && response.success && Array.isArray(response.data)) {
      marketList.value = response.data;
    } else {
      console.error('Failed to fetch market list:', response);
    }
  } catch (error) {
    console.error('Error fetching market list:', error);
  } finally {
    isLoadingMarkets.value = false;
  }
};

// 组件挂载时获取市场列表
onMounted(() => {
  fetchMarketList();
});

// 处理文件选择
const handleImageChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    tradeFile.value = target.files[0];
    selectedFileName.value = target.files[0].name;
    tradeImageError.value = '';
    
    // 验证文件
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
    if (!allowedTypes.includes(tradeFile.value.type)) {
      tradeImageError.value = 'Only image files are allowed (JPG, PNG, GIF)';
      selectedFileName.value = '';
      return;
    }
    
    if (tradeFile.value.size > 5 * 1024 * 1024) {
      tradeImageError.value = 'File size must be less than 5MB';
      selectedFileName.value = '';
      return;
    }
    
    // 上传文件
    isUploading.value = true;
    try {
      // 创建FormData对象
      const formData = new FormData();
      formData.append('file', tradeFile.value);
      
      const fileResponse = await uploadImage(formData);
      if (fileResponse && fileResponse.success && fileResponse.data) {
        fileUrl.value = fileResponse.data.url || '';
       
      } else {
        tradeImageError.value = `Failed to upload file: ${fileResponse?.error || fileResponse?.message || 'Unknown error'}`;
        selectedFileName.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      tradeImageError.value = 'An error occurred during file upload. Please try again.';
      selectedFileName.value = '';
    } finally {
      isUploading.value = false;
    }
  }
};

// 表单验证
const validateForm = (): boolean => {
  // 重置所有错误消息
  symbolError.value = '';
  entryPriceError.value = '';
  quantityError.value = '';
  entryDateError.value = '';
  assetTypeError.value = '';
  directionError.value = '';
  tradeImageError.value = '';
  
  let isValid = true;
  
  // 验证市场
  if (!market.value) {
    assetTypeError.value = 'Market is required';
    isValid = false;
  }
  
  // 验证交易代码
  if (!symbol.value.trim()) {
    symbolError.value = 'Symbol is required';
    isValid = false;
  }
  
  // 验证入场价格
  if (!entryPrice.value || entryPrice.value <= 0) {
    entryPriceError.value = 'Entry price must be greater than 0';
    isValid = false;
  }
  
  // 验证数量
  if (!quantity.value || quantity.value <= 0) {
    quantityError.value = 'Size must be greater than 0';
    isValid = false;
  }
  
  // 验证日期
  if (!selectedDate.value) {
    entryDateError.value = 'Entry date is required';
    isValid = false;
  }
  
  // 验证交易方向
  if (!direction.value) {
    directionError.value = 'Direction is required';
    isValid = false;
  }
  
 
  
  return isValid;
};

// 处理表单提交
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }
  isSaving.value = true;
   console.log(marketList.value)
  let result=marketList.value.filter(element => element.marketname==market.value);
    console.log(result)
  let exchange_rate=result[0].exchange_rate
  try {
    // 如果文件正在上传，等待上传完成
    if (isUploading.value) {
      alert('Please wait for the file upload to complete before submitting the form.');
      isSaving.value = false;
      return;
    }
    
    // 构建提交数据
    // 将选择的日期转换为ISO格式用于提交（使用00:00:00作为默认时间）
    const selectedDateTime = new Date(`${selectedDate.value}T00:00:00`);
    const isoTime = selectedDateTime.toISOString();
    
    const submitData = {
      market: market.value,
      symbol: symbol.value,
      entry_price: entryPrice.value,
      size: quantity.value,
      entry_date: isoTime,
      asset_type: assetType.value,
      direction: direction.value,
      trade_type: '',
      exchange_rate:exchange_rate
    };
    
    // 调用webvipRoutes中的/upload-trade接口
    console.log('提交数据:', submitData);
    const response = await createVipTrade(submitData);
    console.log('API响应:', response);
    
    if (response && response.success) {
      alert('Trade record uploaded successfully!');
      router.push('/vipdashboard');
    } else {
      console.error('上传失败响应:', response);
      alert(`Failed to upload trade record: ${response?.message || response?.data?.message || 'Unknown error'}`);
    }
    isSaving.value = false;
  } catch (error: any) {
    console.error('Upload error:', error);
    console.error('Error details:', error.response?.data);
    alert(`An error occurred during upload: ${error.response?.data?.message || error.message || 'Please try again later.'}`);
  }
};
</script>

<style scoped>
/* 导入Google字体 */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

/* CSS变量定义 */
:root {
  --primary-bg: #0f1419;
  --secondary-bg: #1a2332;

  --accent-hover: #ffed4e;
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --text-dark: #1a2332;
  --border-color: rgba(255, 215, 0, 0.3);
  --border-hover: #ffd700;
  --shadow-color: rgba(0, 0, 0, 0.3);
  --uploading-color: #00ff00;
  --remove-btn-bg: #ff4d4f;
  --remove-btn-hover: #ff7875;
}

/* 全局样式 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #0f1419 0%, #1a2332 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #ffffff;
}

/* 光纤划过动画 */
@keyframes fiberOptic {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* 上传中动画 */
@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0.6;
  }
}

/* 上传中状态样式 */
.uploading-status {
  display: block;
  margin-top: 8px;
  color: var(--uploading-color);
  text-align: center;
  font-size: 0.9rem;
  font-weight: 500;
  animation: pulse 1.5s ease-in-out infinite;
}

/* 图片预览容器 */
.image-preview-container {
  margin-top: 12px;
  text-align: center;
}

/* 图片预览样式 */
.image-preview {
  max-width: 100%;
  max-height: 200px;
  border-radius: 8px;
  border: 2px solid var(--border-color);
  object-fit: contain;
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.image-preview:hover {
  border-color: var(--border-hover);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.2);
}

/* 移除图片按钮 */
.remove-image-btn {
  margin-top: 8px;
  padding: 6px 16px;
  background: var(--remove-btn-bg);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image-btn:hover {
  background: var(--remove-btn-hover);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(255, 77, 79, 0.3);
}

/* 注册容器 */
.login-container {
  background: rgba(26, 35, 50, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 450px;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 50px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 215, 0, 0.2);
}

/* 注册头部 */
.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header .avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  color: var(--text-dark);
  font-size: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
}

.login-header h1 {
  color: var(--text-primary);
  font-size: 1.8rem;
  margin-bottom: 8px;
  font-weight: 600;
}

.login-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.95rem;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--border-color);
  border-radius: 10px;
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--border-hover);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
}
.form-group select option{
  background: #1a2332;
}
.form-group input::placeholder {
  color: var(--text-secondary);
}


.error-message {
  color: #ff4d4f;
  font-size: 0.85rem;
  margin-top: 4px;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
  border: none;
  border-radius: 10px;
  color: var(--text-dark);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 20px;
}

/* 禁用状态的登录按钮 */
.login-btn:disabled {
  background: linear-gradient(135deg, #6c757d 0%, #adb5bd 100%);
  color: #495057;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-btn:hover {
  background: linear-gradient(135deg, #ffed4e 0%, #ffd700 100%);
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(255, 215, 0, 0.3);
}

/* 分隔线 */
.divider {
  text-align: center;
  margin: 20px 0;
  position: relative;
}

.divider::before,
.divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background: rgba(255, 255, 255, 0.2);
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  color: var(--text-secondary);
  font-size: 0.9rem;
  background: rgba(26, 35, 50, 0.95);
  padding: 0 15px;
}

/* 链接样式 */
.signup-link,
.back-link {
  text-align: center;
  margin-top: 20px;
}

.signup-link p,
.back-link a {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.signup-link a,
.back-link a {
  color: #ffd700;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.signup-link a:hover,
.back-link a:hover {
  color: var(--accent-hover);
  text-decoration: underline;
}
</style>