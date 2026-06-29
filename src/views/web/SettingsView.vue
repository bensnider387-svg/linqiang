<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <navcomponent></navcomponent>

    <!-- 设置页面容器 -->
    <div class="login-container">
      <div class="login-header">
        <div class="avatar">⚙️</div>
        <h1>Settings</h1>
        <p>Manage your account preferences</p>
      </div>

      <form>
        <div class="form-group">
          <label for="currentPassword">Current Password</label>
          <input type="password" id="currentPassword" v-model="currentPassword" placeholder="Enter current password" required>
          <div v-if="currentPasswordError" class="error-message">{{ currentPasswordError }}</div>
        </div>
        
        <div class="form-group">
          <label for="newPassword">New Password</label>
          <input type="password" id="newPassword" v-model="newPassword" placeholder="Enter new password">
          <div v-if="newPasswordError" class="error-message">{{ newPasswordError }}</div>
        </div>
        
        <div class="form-group">
          <label for="confirmPassword">Confirm New Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" placeholder="Confirm new password">
          <div v-if="confirmPasswordError" class="error-message">{{ confirmPasswordError }}</div>
        </div>
        
        <button type="button" class="login-btn" @click="handleSave" :disabled="isSaving">
          <template v-if="!isSaving">Save Changes</template>
          <template v-else>Saving...</template>
        </button>
      </form>
      
      <div class="back-link">
        <router-link to="/vipdashboard">Back to Dashboard</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import navcomponent from '../component/nav/nav.vue';
import { getCurrentUser } from '../../api/module/user';
import { changePassword } from '../../api/module/web/vip';

const router = useRouter();

// 表单数据
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 错误消息
const currentPasswordError = ref('');
const newPasswordError = ref('');
const confirmPasswordError = ref('');
let currentUserId = ref('');

// 保存状态
const isSaving = ref(false);

// 页面加载时获取当前用户信息
import { onMounted } from 'vue';

onMounted(async () => {
  try {
    const userResponse = await getCurrentUser();
    if (userResponse && userResponse.success && userResponse.data) {
      currentUserId.value = userResponse.data.id || '';
      // 如果有初始资金信息，可以在这里加载
      // initialCapital.value = userResponse.data.initialCapital || 0;
    }
  } catch (error) {
    console.error('Failed to get current user:', error);
  }
});

// 表单验证
const validateForm = (): boolean => {
  // 重置所有错误消息
  currentPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';
  
  let isValid = true;
  
  // 验证当前密码
  if (!currentPassword.value.trim()) {
    currentPasswordError.value = 'Current password is required';
    isValid = false;
  }
  
  // 验证新密码（如果填写了）
  if (newPassword.value.trim() && newPassword.value.length < 6) {
    newPasswordError.value = 'New password must be at least 6 characters';
    isValid = false;
  }
  
  // 验证确认密码
  if (newPassword.value.trim() && confirmPassword.value.trim() !== newPassword.value.trim()) {
    confirmPasswordError.value = 'Passwords do not match';
    isValid = false;
  }
  
  // 至少需要修改密码
  if (!newPassword.value.trim()) {
    alert('Please enter a new password');
    isValid = false;
  }
  
  return isValid;
};

// 处理保存设置
const handleSave = async () => {
  // 防止重复提交
  if (isSaving.value) {
    return;
  }
  
  if (!validateForm()) {
    return;
  }
  
  try {
    // 设置保存状态
    isSaving.value = true;
    
    if (!currentUserId.value) {
      alert('User information not found. Please try again.');
      isSaving.value = false;
      return;
    }
    
    // 构建提交数据（注意：后端接口要求的参数名是old_password_hash和new_password_hash）
    const passwordData: any = {
      old_password_hash: currentPassword.value,
      new_password_hash: newPassword.value
    };
    
    // 调用API修改密码
    const response = await changePassword(passwordData);
    
    if (response && response.success) {
      alert('Settings saved successfully!');
      router.push('/vipdashboard');
    } else {
      alert(`Failed to save settings: ${response.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Save settings error:', error);
    alert('An error occurred while saving settings. Please try again later.');
  } finally {
    // 重置保存状态
    isSaving.value = false;
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