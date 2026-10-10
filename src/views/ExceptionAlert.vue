<template>
  <div class="page-container">
    <!-- 统计卡片 -->
    <el-row :gutter="16">
      <el-col :span="6">
        <el-card shadow="never" class="stat-card stat-danger">
          <div class="stat-num">{{ unreadCount }}</div>
          <div class="stat-label">未处理预警</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card stat-warning">
          <div class="stat-num">{{ overdueCount }}</div>
          <div class="stat-label">超时未离校</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card stat-info">
          <div class="stat-num">{{ unauthorizedCount }}</div>
          <div class="stat-label">未授权进入</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never" class="stat-card">
          <div class="stat-num">{{ alertList.length }}</div>
          <div class="stat-label">全部预警</div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 预警列表 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>异常预警列表</span>
          <el-button @click="markAllRead">全部已读</el-button>
        </div>
      </template>

      <el-table :data="alertList" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="type" label="预警类型" min-width="100">
          <template #default="{ row }">
            <el-tag :type="alertTagType(row.type)" size="small">{{ alertTypeLabel(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="personName" label="人员" min-width="80" />
        <el-table-column prop="personType" label="人员类型" min-width="90">
          <template #default="{ row }">
            <el-tag size="small">{{ typeLabel(row.personType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="description" label="预警描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="time" label="预警时间" min-width="150" />
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'handled' ? 'success' : row.status === 'read' ? 'info' : 'danger'" size="small">
              {{ statusMap[row.status as keyof typeof statusMap] }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="150">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleRead(row)" v-if="row.status === 'unread'">标记已读</el-button>
            <el-button type="success" link size="small" @click="handleProcess(row)" v-if="row.status !== 'handled'">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import type { AlertRecord, VisitorType } from '@/types'

const typeMap: Record<VisitorType, string> = { visitor: '访客', teacher: '教师', student: '学生', manager: '校园管理者' }
const typeLabel = (t: VisitorType) => typeMap[t] || t
const alertTypeLabelMap: Record<string, string> = { unauthorized: '未授权进入', overdue: '超时未离校', frequency: '频繁出入', blacklist: '黑名单命中' }
const alertTypeLabel = (t: string) => alertTypeLabelMap[t] || t
const alertTagMap: Record<string, string> = { unauthorized: 'danger', overdue: 'warning', frequency: 'info', blacklist: 'danger' }
const alertTagType = (t: string) => alertTagMap[t] || 'info'
const statusMap: Record<string, string> = { unread: '未读', read: '已读', handled: '已处理' }

/* 模拟数据 */
const alertList = ref<AlertRecord[]>([
  { id: 1, type: 'unauthorized', personName: '赵访客', personType: 'visitor', phone: '13600136000', description: '未持有有效通行证尝试进入实验楼', time: '2025-07-01 10:30:00', status: 'unread' },
  { id: 2, type: 'overdue', personName: '王伟', personType: 'visitor', phone: '13700137000', description: '访客已超过预约时间2小时未离校', time: '2025-07-01 12:00:00', status: 'unread' },
  { id: 3, type: 'frequency', personName: '李同学', personType: 'student', phone: '15000150000', description: '当日出入校门超过5次', time: '2025-07-01 13:00:00', status: 'read' },
  { id: 4, type: 'blacklist', personName: '钱某', personType: 'visitor', phone: '13500135000', description: '命中校园黑名单人员库', time: '2025-07-01 08:15:00', status: 'handled' },
  { id: 5, type: 'unauthorized', personName: '孙某', personType: 'visitor', phone: '13400134000', description: '非工作时间进入办公区域', time: '2025-07-01 22:00:00', status: 'unread' },
])

const unreadCount = computed(() => alertList.value.filter((a) => a.status === 'unread').length)
const overdueCount = computed(() => alertList.value.filter((a) => a.type === 'overdue').length)
const unauthorizedCount = computed(() => alertList.value.filter((a) => a.type === 'unauthorized').length)

const handleRead = (row: AlertRecord) => { row.status = 'read' }
const handleProcess = (row: AlertRecord) => {
  row.status = 'handled'
  ElMessage.success('已处理')
}
const markAllRead = () => {
  alertList.value.forEach((a) => { if (a.status === 'unread') a.status = 'read' })
  ElMessage.success('已全部标记为已读')
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.stat-card { border-radius: 8px; text-align: center; }
.stat-num { font-size: 32px; font-weight: 700; color: #303133; }
.stat-label { font-size: 14px; color: #909399; margin-top: 4px; }
.stat-danger .stat-num { color: #f56c6c; }
.stat-warning .stat-num { color: #e6a23c; }
.stat-info .stat-num { color: #909399; }
.table-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
