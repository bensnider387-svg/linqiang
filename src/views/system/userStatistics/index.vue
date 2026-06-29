<template>
  <lay-container :fluid="true" class="user-statistics-page">
    <!-- 顶部概览卡片 -->
    <lay-row :space="10">
      <lay-col :md="6" :sm="6" :xs="6">
        <lay-card style="height: 150px">
            <template #title><i class="layui-icon layui-icon-username" style="color: #1E9FFF;"></i> 总用户数</template>
            <lay-row style="text-align: center; margin-top: 10px">
              <lay-row style="font-size: 35px; color: #000000e0; margin: 20px;">
                {{ overview.totalUsers || 0 }}
              </lay-row>
              <lay-row>
                <lay-badge type="dot" color="green" ripple></lay-badge>&nbsp;
                本周新增: {{ weeklyNewUsers || 0 }}
              </lay-row>
            </lay-row>
          </lay-card>
        </lay-col>
        
        <lay-col :md="6" :sm="6" :xs="6">
          <lay-card style="height: 150px">
            <template #title><i class="layui-icon layui-icon-user" style="color: #5FB878;"></i> 3天活跃用户</template>
            <lay-row style="text-align: center; margin-top: 10px">
              <lay-row style="font-size: 35px; color: #000000e0; margin: 20px;">
                {{ overview.activeUsers || 0 }}
              </lay-row>
              <lay-row>
                <lay-badge type="dot" :color="getActiveRateColor()" ripple></lay-badge>&nbsp;
                活跃率: {{ activeRate }}%
              </lay-row>
            </lay-row>
          </lay-card>
        </lay-col>
        
        <lay-col :md="6" :sm="6" :xs="6">
          <lay-card style="height: 150px">
            <template #title><i class="layui-icon layui-icon-addition" style="color: #FFB800;"></i> 本月新增</template>
            <lay-row style="text-align: center; margin-top: 10px">
              <lay-row style="font-size: 35px; color: #000000e0; margin: 20px;">
                {{ overview.monthlyNewUsers || 0 }}
              </lay-row>
              <lay-row>
                <lay-badge type="dot" :color="monthlyGrowth > 0 ? 'green' : 'red'" ripple></lay-badge>&nbsp;
                {{ monthlyGrowth > 0 ? '+' : '' }}{{ monthlyGrowth }}%
              </lay-row>
            </lay-row>
          </lay-card>
        </lay-col>
        
        <lay-col :md="6" :sm="6" :xs="6">
          <lay-card style="height: 150px">
            <template #title><i class="layui-icon layui-icon-set" style="color: #2F4056;"></i> 角色分布</template>
            <lay-row style="text-align: center; margin-top: 10px">
              <lay-row style="font-size: 16px; color: #000000e0; margin: 20px;">
                <div>管理员: {{ overview.roleDistribution?.admin || 0 }}</div>
                <div style="margin-top: 5px">普通用户: {{ overview.roleDistribution?.user || 0 }}</div>
              </lay-row>
            </lay-row>
          </lay-card>
        </lay-col>
    </lay-row>
    
    <!-- 主要图表区域 -->
    <lay-row :space="10">
      <lay-col :md="12" :sm="12" :xs="24">
       <lay-card>
          <template #title>
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <div><i class="layui-icon layui-icon-table"></i> 用户统计详情</div>
                <i @click="refreshData" size="sm" type="normal" icon="layui-icon-refresh-three"></i>
              </div>
            </template>
          
            <lay-table
            
              :height="400"
              :columns="columns"
              :loading="loading"
              :default-toolbar="false"
              :data-source="growthData"
              style="width: 100%"
            ></lay-table>
        </lay-card>
      </lay-col>
      
      <lay-col :md="12" :sm="12" :xs="24">
        <lay-card>
          <template #title><i class="layui-icon layui-icon-pie-chart"></i> 用户资产分布</template>
          <div id="assetChart" ref="assetChartRef"></div>
        </lay-card>
      </lay-col>
    </lay-row>
    
    <!-- 数据表格区域 -->
    <lay-row :space="10" style="margin-top: 10px">
      <lay-col :md="24" :sm="24" :xs="24">
          <lay-card>
          <template #title><i class="layui-icon layui-icon-line-chart"></i> 用户增长趋势（最近9天）</template>
          <div id="growthChart" ref="growthChartRef"></div>
        </lay-card>
       
      </lay-col>
    </lay-row>
  </lay-container>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { layer } from '@layui/layui-vue'
import * as echarts from 'echarts';
import { getUserOverview, getUserGrowth, getUserAssetDistribution } from '../../../api/module/userStatistics';
import { useUserStore } from '@/store';

// 引用
const growthChartRef = ref<HTMLDivElement>();
const assetChartRef = ref<HTMLDivElement>();

// 状态
const loading = ref(false);
const overview = ref<any>({});
const growthData = ref<any[]>([]);
const assetDistributionData = ref<any[]>([]);

// 计算属性
const weeklyNewUsers = ref(0);
const activeRate = ref(0);
const monthlyGrowth = ref(0);

// 获取活跃率对应的颜色
const getActiveRateColor = () => {
  if (activeRate.value > 80) return 'green';
  if (activeRate.value > 50) return 'orange';
  return 'red';
};
// 表格列配置
const columns = ref([
  { title: '日期', width: '200px', key: 'date' },
  { title: '新增用户', key: 'dailyNew' },
  { title: '累计用户', key: 'count' },
])
// 图表实例
let growthChart: echarts.ECharts | null = null;
let assetChart: echarts.ECharts | null = null;

const handleResize = () => {
  growthChart?.resize();
  assetChart?.resize();
};

// 初始化数据
onMounted(async () => {
  await loadData();
  await nextTick();
  initCharts();
  updateCharts();
  window.addEventListener('resize', handleResize);
});

// 销毁图表
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (growthChart) {
    growthChart.dispose();
    growthChart = null;
  }
  if (assetChart) {
    assetChart.dispose();
    assetChart = null;
  }
});

// 刷新数据
async function refreshData() {
  await loadData();
  await nextTick();
  updateCharts();
  layer.msg('数据已刷新', { icon: 1 });
};

const getUserOverviewapi=async ()=>{
  try
  {
  const overviewResponse= await getUserOverview()
   // 处理概览数据
    if (overviewResponse.success) {
      overview.value = overviewResponse.data;
      calculateDerivedStats();
    }
  }
  catch (error) {
    console.error('获取用户概览失败:', error);
    layer.msg('获取用户概览失败', { icon: 2 });
  }
}
const getUserGrowthapi=async ()=>{
  try
  {
  const growthResponse= await getUserGrowth()
  // 处理增长数据
    if (growthResponse.success) {
      // 计算累计用户数和增长率
      const processedData = growthResponse.data.map((item: any, index: number) => {
        const prevCount = index > 0 ? growthResponse.data[index - 1].count : 0;
        const dailyNew = index > 0 ? item.count - prevCount : 0;
        return {
          ...item,
          dailyNew,
          prevCount
        };
      });
      growthData.value = processedData.slice(1);
    }
  }
    catch (error) {
      console.error('获取用户增长趋势失败:', error);
      layer.msg('获取用户增长趋势失败', { icon: 2 });
    }
}
const getUserAssetDistributionapi=async ()=>{
  try
  {
    const assetResponse= await getUserAssetDistribution()
    // 处理资产分布数据
      if (assetResponse.success) {
        assetDistributionData.value = assetResponse.data;
      }
  }
    catch (error) {
      console.error('获取用户资产分布失败:', error);
      layer.msg('获取用户资产分布失败', { icon: 2 });
    }
}
// 加载数据
 const loadData=async () => {
  loading.value = true;
  
  try {
   await getUserOverviewapi()
   await getUserGrowthapi()
   await getUserAssetDistributionapi()
  } catch (error) {
    console.error('加载统计数据失败:', error);
    layer.msg('加载统计数据失败', { icon: 2 });
  } finally {
    loading.value = false;
  }
}

// 计算派生统计数据
function calculateDerivedStats() {
  // 周新增用户
  weeklyNewUsers.value = overview.value.weeklyNewUsers || 0;
  
  // 活跃率
  if (overview.value.totalUsers > 0) {
    activeRate.value = Math.round((overview.value.activeUsers / overview.value.totalUsers) * 100);
  }
  
  // 月增长率（假设上月新增用户为当月的80%）
  const monthlyNewUsers = overview.value.monthlyNewUsers || 0;
  const lastMonthNewUsers = Math.round(monthlyNewUsers * 0.8); // 简单估算
  if (lastMonthNewUsers > 0) {
    monthlyGrowth.value = Math.round(((monthlyNewUsers - lastMonthNewUsers) / lastMonthNewUsers) * 100);
  }
}

// 初始化图表
function initCharts() {
  // 初始化增长趋势图
  if (growthChartRef.value) {
    growthChart = echarts.init(growthChartRef.value);
  }
  
  // 初始化资产分布图
  if (assetChartRef.value) {
    assetChart = echarts.init(assetChartRef.value);
  }
}

// 更新图表
function updateCharts() {
  // 更新增长趋势图
  if (growthChart && growthData.value.length > 0) {
    const dates = growthData.value.map((item: any) => item.date);
    const counts = growthData.value.map((item: any) => item.dailyNew);
    const cumulatives = growthData.value.map((item: any) => item.count);
    
    const growthOption = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          label: {
            backgroundColor: '#6a7985'
          }
        }
      },
      legend: {
        data: ['新增用户', '累计用户']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          interval: 0,
          rotate: dates.length > 6 ? 45 : 0
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '新增用户',
          position: 'left'
        },
        {
          type: 'value',
          name: '累计用户',
          position: 'right'
        }
      ],
      series: [
        {
          name: '新增用户',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          emphasis: {
            focus: 'series'
          },
          data: counts,
          lineStyle: {
            color: '#5b8ff9'
          },
          itemStyle: {
            color: '#5b8ff9'
          }
        },
        {
          name: '累计用户',
          type: 'line',
          yAxisIndex: 1,
          emphasis: {
            focus: 'series'
          },
          data: cumulatives,
          lineStyle: {
            color: '#61ddaa'
          },
          itemStyle: {
            color: '#61ddaa'
          }
        }
      ]
    };
    
    growthChart.setOption(growthOption);
    growthChart.resize();
  }
  
  // 更新资产分布图
  if (assetChart && assetDistributionData.value.length > 0) {
    const labels = assetDistributionData.value.map((item: any) => item.range);
    const values = assetDistributionData.value.map((item: any) => item.count);
    
    const assetOption = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)'
      },
      legend: {
        bottom: 0,
        left: 'center',
        data: labels
      },
      series: [
        {
          name: '资产分布',
          type: 'pie',
          radius: ['40%', '62%'],
          center: ['50%', '42%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
            position: 'center'
          },
          labelLine: {
            show: false
          },
          color: ['#5b8ff9', '#61ddaa', '#f6bd16', '#7262fd', '#78d3f8'],
          data: values.map((value: number, index: number) => ({
            value,
            name: labels[index]
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
    
    assetChart.setOption(assetOption);
    assetChart.resize();
  }
}
</script>

<style scoped>
.user-statistics-page {
  padding: 10px;
  padding-bottom: 24px;
}

#growthChart {
  width: 100%;
  height: 400px;
  min-height: 400px;
}

#assetChart {
  width: 100%;
  height: 400px;
  min-height: 400px;
}

.no-data {
  text-align: center;
  padding: 40px 0;
  color: #999;
}

.no-data .layui-icon {
  font-size: 48px;
  margin-bottom: 10px;
  display: block;
}

.text-green {
  color: #5FB878;
}

.text-red {
  color: #FF5722;
}

.text-gray {
  color: #999;
}

/* 响应式设计 */
@media (max-width: 768px) {
  #growthChart,
  #assetChart {
    height: 300px;
  }
}
</style>