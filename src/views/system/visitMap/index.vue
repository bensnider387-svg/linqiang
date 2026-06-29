<template>
  <lay-container :fluid="true" class="visit-map-page">
    <div class="scope-hint">
      <template v-if="!isSuperAdmin">
        当前仅显示访问<strong>本交易员网站</strong>的 IP（按登录账号绑定的交易员过滤）。
      </template>
      仅统计<strong>浏览器加载页面后主动上报</strong>的真实用户访问，爬虫和扫描器不会计入。
      <span v-if="summary.statsStartAt">（统计自 {{ formatTime(summary.statsStartAt) }} 起）</span>
      <span v-if="summary.filteredBotCount">（本周期另排除 {{ summary.filteredBotCount }} 条异常记录）</span>
    </div>
    <lay-row :space="10">
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>独立访客</template>
          <div class="stat-value">{{ summary.totalVisits || 0 }}</div>
          <div class="stat-sub">最近 {{ selectedDays }} 天（同一 IP 只计 1 次）</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>总访问次数</template>
          <div class="stat-value">{{ summary.totalVisitCount || 0 }}</div>
          <div class="stat-sub">同一 IP 多次访问累计</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>覆盖国家</template>
          <div class="stat-value">{{ summary.uniqueCountries || 0 }}</div>
          <div class="stat-sub">有定位信息的国家</div>
        </lay-card>
      </lay-col>
      <lay-col :md="6" :sm="12" :xs="24">
        <lay-card class="stat-card">
          <template #title>访问城市</template>
          <div class="stat-value">{{ summary.cities?.length || 0 }}</div>
          <div class="stat-sub">地图上的城市点</div>
        </lay-card>
      </lay-col>
    </lay-row>

    <lay-card style="margin-top: 10px">
      <template #title>
        <div class="toolbar">
          <span>全球访问地图</span>
          <div class="toolbar-actions">
            <lay-select v-model="selectedDays" size="sm" style="width: 120px" @change="loadData">
              <lay-select-option :value="1" label="最近1天" />
              <lay-select-option :value="7" label="最近7天" />
              <lay-select-option :value="30" label="最近30天" />
              <lay-select-option :value="90" label="最近90天" />
            </lay-select>
            <lay-button size="sm" type="primary" @click="loadData">刷新</lay-button>
          </div>
        </div>
      </template>
      <div ref="mapChartRef" class="map-chart"></div>
    </lay-card>

    <lay-card style="margin-top: 10px">
      <template #title>最近访问记录</template>
      <lay-table
        :height="420"
        :columns="columns"
        :loading="loading"
        :data-source="tableData"
        :page="page"
        @change="handlePageChange"
      />
    </lay-card>
  </lay-container>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, reactive, ref, nextTick } from 'vue';
import { layer } from '@layui/layui-vue';
import * as echarts from 'echarts';
import {
  getPageVisits,
  getVisitMapSummary,
  type PageVisit,
  type VisitMapSummary,
} from '../../../api/module/pageVisits';
import { useUserStore } from '../../../store/user';

const userStore = useUserStore();
const isSuperAdmin = computed(
  () =>
    summary.value.isSuperAdmin === true ||
    userStore.userInfo?.role === 'superadmin'
);

const loading = ref(false);
const selectedDays = ref(7);
const summary = ref<VisitMapSummary>({
  totalVisits: 0,
  uniqueIps: 0,
  uniqueCountries: 0,
  cities: [],
  recent: [],
});
const tableData = ref<PageVisit[]>([]);
const mapChartRef = ref<HTMLDivElement>();
let mapChart: echarts.ECharts | null = null;
let worldMapRegistered = false;

const page = reactive({ current: 1, limit: 10, total: 0 });

const formatTime = (value?: string | null) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString('zh-CN', { hour12: false });
};

const baseColumns = [
  { title: 'IP 地址', width: '150px', key: 'ip_address' },
  { title: '用户', width: '100px', key: 'visitor_label' },
  { title: '访问次数', width: '90px', key: 'visit_count' },
  { title: '国家', width: '80px', key: 'country' },
  { title: '城市', width: '100px', key: 'city' },
  { title: '访问域名', width: '200px', key: 'visit_url' },
  { title: '首次访问', width: '170px', key: 'first_visited_at' },
  { title: '最近访问', width: '170px', key: 'visited_at' },
];

const columns = computed(() => {
  if (!isSuperAdmin.value) return baseColumns;
  return [
    baseColumns[0],
    { title: '访问交易员', width: '140px', key: 'trader_name' },
    ...baseColumns.slice(1),
  ];
});

const ensureWorldMap = async () => {
  if (worldMapRegistered) return;
  const response = await fetch('/geo/world.json');
  if (!response.ok) {
    throw new Error('无法加载世界地图数据');
  }
  const worldJson = await response.json();
  echarts.registerMap('world', worldJson);
  worldMapRegistered = true;
};

const renderMap = async () => {
  await nextTick();
  if (!mapChartRef.value) return;
  await ensureWorldMap();

  if (!mapChart) {
    mapChart = echarts.init(mapChartRef.value);
  }

  const scatterData = (summary.value.cities || []).map((item) => ({
    name: `${item.city}, ${item.country}`,
    value: [item.longitude, item.latitude, item.count],
    city: item.city,
    country: item.country,
    count: item.count,
  }));

  mapChart.setOption({
    backgroundColor: '#0b1220',
    tooltip: {
      trigger: 'item',
      formatter: (params: any) => {
        const data = params.data || {};
        return [
          `<strong>${data.city || data.name || 'Unknown'}</strong>`,
          `国家/地区: ${data.country || '-'}`,
          `访问次数: ${data.count || data.value?.[2] || 0}`,
        ].join('<br/>');
      },
    },
    geo: {
      map: 'world',
      roam: true,
      zoom: 1.2,
      label: { show: false },
      itemStyle: {
        areaColor: '#1a2332',
        borderColor: '#334155',
      },
      emphasis: {
        itemStyle: { areaColor: '#243044' },
      },
    },
    series: [
      {
        name: '访问城市',
        type: 'scatter',
        coordinateSystem: 'geo',
        data: scatterData,
        symbolSize: (val: number[]) => Math.max(10, Math.min(36, (val[2] || 1) * 4)),
        itemStyle: {
          color: '#38bdf8',
          shadowBlur: 12,
          shadowColor: 'rgba(56, 189, 248, 0.45)',
        },
        emphasis: {
          itemStyle: { color: '#fbbf24' },
        },
      },
    ],
  });
};

const loadTable = async () => {
  const offset = (page.current - 1) * page.limit;
  const res = await getPageVisits({
    offset,
    limit: page.limit,
    days: selectedDays.value,
  });
  if (res.success) {
    tableData.value = res.data || [];
    page.total = res.total || 0;
  }
};

const loadData = async () => {
  loading.value = true;
  try {
    const res = await getVisitMapSummary(selectedDays.value);
    if (res.success) {
      summary.value = res.data;
      try {
        await renderMap();
      } catch (mapError) {
        console.error(mapError);
        layer.msg('地图加载失败，访问列表仍可查看', { icon: 2 });
      }
      await loadTable();
    } else {
      layer.msg(res.message || '加载访问地图失败', { icon: 2 });
    }
  } catch (error) {
    console.error(error);
    layer.msg('加载访问地图失败', { icon: 2 });
  } finally {
    loading.value = false;
  }
};

const handlePageChange = ({ current }: { current: number }) => {
  page.current = current;
  loadTable();
};

const handleResize = () => {
  mapChart?.resize();
};

onMounted(async () => {
  await loadData();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  mapChart?.dispose();
  mapChart = null;
});
</script>

<style scoped>
.visit-map-page {
  padding-bottom: 16px;
}

.scope-hint {
  margin-bottom: 10px;
  padding: 10px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  color: #1e40af;
  font-size: 13px;
}

.stat-card {
  min-height: 120px;
}

.stat-value {
  font-size: 34px;
  font-weight: 700;
  color: #111827;
  margin-top: 8px;
}

.stat-sub {
  margin-top: 8px;
  color: #6b7280;
  font-size: 13px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.toolbar-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.map-chart {
  width: 100%;
  height: 520px;
  border-radius: 12px;
  overflow: hidden;
}
</style>
