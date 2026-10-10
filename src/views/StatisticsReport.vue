<template>
  <div class="page-container">
    <!-- 顶部统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-icon" style="background: #ecf5ff; color: #409eff;">
            <el-icon :size="28"><Top /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.totalIn }}</div>
            <div class="stat-label">今日进入</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-icon" style="background: #fdf6ec; color: #e6a23c;">
            <el-icon :size="28"><Bottom /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.totalOut }}</div>
            <div class="stat-label">今日离开</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-icon" style="background: #f0f9eb; color: #67c23a;">
            <el-icon :size="28"><User /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.todayVisitors }}</div>
            <div class="stat-label">今日访客</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-icon" style="background: #fef0f0; color: #f56c6c;">
            <el-icon :size="28"><Warning /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-num">{{ stats.alertCount }}</div>
            <div class="stat-label">待处理预警</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="16">
      <!-- 近7日出入趋势 -->
      <el-col :span="14">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <div class="card-header">
              <span>近7日出入趋势</span>
              <el-radio-group v-model="chartType" size="small">
                <el-radio-button value="week">近7天</el-radio-button>
                <el-radio-button value="month">近30天</el-radio-button>
              </el-radio-group>
            </div>
          </template>
          <div class="chart-placeholder">
            <div class="bar-chart">
              <div v-for="(item, idx) in weeklyData" :key="idx" class="bar-item">
                <div class="bar-value">{{ item.count }}</div>
                <div class="bar" :style="{ height: (item.count / maxCount * 180) + 'px' }"></div>
                <div class="bar-label">{{ item.date }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <!-- 人员类型分布 -->
      <el-col :span="10">
        <el-card shadow="never" class="chart-card">
          <template #header>
            <span>人员类型分布</span>
          </template>
          <div class="chart-placeholder">
            <div class="pie-chart">
              <div v-for="(item, idx) in typeDistribution" :key="idx" class="pie-item">
                <div class="pie-color" :style="{ background: pieColors[idx] }"></div>
                <span class="pie-label">{{ item.type }}</span>
                <span class="pie-count">{{ item.count }}</span>
                <span class="pie-percent">{{ ((item.count / totalDistribution) * 100).toFixed(1) }}%</span>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 闸口通行统计 -->
    <el-card shadow="never" class="chart-card">
      <template #header>
        <div class="card-header">
          <span>各闸口通行统计</span>
          <el-button type="primary" size="small">
            <el-icon><Download /></el-icon>导出报表
          </el-button>
        </div>
      </template>
      <el-table :data="gateStats" stripe border style="width: 100%">
        <el-table-column prop="gate" label="闸口" min-width="90" />
        <el-table-column prop="totalIn" label="进入人数" min-width="90" />
        <el-table-column prop="totalOut" label="离开人数" min-width="90" />
        <el-table-column prop="peakTime" label="高峰时段" min-width="110" />
        <el-table-column prop="peakCount" label="高峰人次" min-width="90" />
        <el-table-column label="通行率" min-width="180">
          <template #default="{ row }">
            <el-progress :percentage="row.rate" :stroke-width="14" />
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Top, Bottom, User, Warning, Download } from '@element-plus/icons-vue'

/* 统计数据 */
const stats = ref({
  totalIn: 1286,
  totalOut: 1150,
  todayVisitors: 89,
  alertCount: 5,
})

const chartType = ref('week')

/* 近7日数据 */
const weeklyData = ref([
  { date: '06-25', count: 1850 },
  { date: '06-26', count: 1920 },
  { date: '06-27', count: 1780 },
  { date: '06-28', count: 1650 },
  { date: '06-29', count: 1420 },
  { date: '06-30', count: 2010 },
  { date: '07-01', count: 1286 },
])

const maxCount = computed(() => Math.max(...weeklyData.value.map((d) => d.count)))

/* 类型分布 */
const typeDistribution = ref([
  { type: '学生', count: 8500 },
  { type: '教师', count: 1200 },
  { type: '访客', count: 650 },
  { type: '校园管理者', count: 150 },
])

const totalDistribution = computed(() => typeDistribution.value.reduce((sum, d) => sum + d.count, 0))
const pieColors = ['#409eff', '#67c23a', '#e6a23c', '#f56c6c']

/* 闸口统计 */
const gateStats = ref([
  { gate: '东门', totalIn: 420, totalOut: 380, peakTime: '08:00-09:00', peakCount: 186, rate: 85 },
  { gate: '西门', totalIn: 310, totalOut: 290, peakTime: '12:00-13:00', peakCount: 142, rate: 72 },
  { gate: '南门', totalIn: 350, totalOut: 320, peakTime: '17:00-18:00', peakCount: 168, rate: 78 },
  { gate: '北门', totalIn: 206, totalOut: 160, peakTime: '09:00-10:00', peakCount: 95, rate: 65 },
])
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }

.stat-card { border-radius: 8px; }
.stat-card :deep(.el-card__body) {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
}
.stat-icon {
  width: 56px; height: 56px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.stat-num { font-size: 28px; font-weight: 700; color: #303133; line-height: 1.2; }
.stat-label { font-size: 13px; color: #909399; }

.chart-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }

/* 简易柱状图 */
.chart-placeholder { padding: 16px 0; }
.bar-chart { display: flex; align-items: flex-end; justify-content: space-around; height: 240px; }
.bar-item { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.bar-value { font-size: 12px; color: #606266; }
.bar {
  width: 36px;
  background: linear-gradient(180deg, #409eff, #79bbff);
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.5s;
}
.bar-label { font-size: 12px; color: #909399; }

/* 简易饼图 */
.pie-chart { display: flex; flex-direction: column; gap: 16px; padding: 16px 0; }
.pie-item { display: flex; align-items: center; gap: 10px; }
.pie-color { width: 16px; height: 16px; border-radius: 3px; flex-shrink: 0; }
.pie-label { font-size: 14px; color: #303133; width: 80px; }
.pie-count { font-size: 14px; color: #606266; font-weight: 600; }
.pie-percent { font-size: 13px; color: #909399; }
</style>
