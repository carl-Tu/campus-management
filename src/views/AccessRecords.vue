<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" clearable />
        </el-form-item>
        <el-form-item label="方向">
          <el-select v-model="searchForm.direction" placeholder="请选择" clearable>
            <el-option label="进入" value="in" />
            <el-option label="离开" value="out" />
          </el-select>
        </el-form-item>
        <el-form-item label="闸口">
          <el-select v-model="searchForm.gate" placeholder="请选择" clearable>
            <el-option label="东门" value="东门" />
            <el-option label="西门" value="西门" />
            <el-option label="南门" value="南门" />
            <el-option label="北门" value="北门" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期">
          <el-date-picker v-model="searchForm.dateRange" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
          <el-button type="success" @click="handleExport">
            <el-icon><Download /></el-icon>导出
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 表格 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>出入记录</span>
          <el-tag type="info">共 {{ recordList.length }} 条</el-tag>
        </div>
      </template>

      <el-table :data="recordList" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="personName" label="姓名" min-width="80" />
        <el-table-column prop="personType" label="人员类型" min-width="90">
          <template #default="{ row }">
            <el-tag size="small">{{ typeLabel(row.personType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="direction" label="方向" min-width="70">
          <template #default="{ row }">
            <el-tag :type="row.direction === 'in' ? 'success' : 'warning'" size="small">
              {{ row.direction === 'in' ? '进入' : '离开' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="gate" label="闸口" min-width="70" />
        <el-table-column prop="time" label="时间" min-width="150" />
        <el-table-column prop="verifyMethod" label="验证方式" min-width="90">
          <template #default="{ row }">
            {{ verifyMap[row.verifyMethod as keyof typeof verifyMap] || row.verifyMethod }}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end;"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Download } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { AccessRecord, VisitorType } from '@/types'

const typeMap: Record<VisitorType, string> = { visitor: '访客', teacher: '教师', student: '学生', manager: '校园管理者' }
const typeLabel = (t: VisitorType) => typeMap[t] || t
const verifyMap: Record<string, string> = { face: '人脸识别', card: '刷卡', qr: '二维码' }

/* 搜索 */
const searchForm = reactive({
  name: '', direction: '', gate: '', dateRange: null as unknown,
})
const pagination = reactive({ page: 1, size: 10, total: 6 })

/* 模拟数据 */
const recordList = ref<AccessRecord[]>([
  { id: 1, personName: '王伟', personType: 'visitor', phone: '13700137000', direction: 'in', gate: '东门', time: '2025-07-01 08:30:00', verifyMethod: 'face' },
  { id: 2, personName: '张老师', personType: 'teacher', phone: '13900139000', direction: 'in', gate: '南门', time: '2025-07-01 08:00:00', verifyMethod: 'card' },
  { id: 3, personName: '李同学', personType: 'student', phone: '15000150000', direction: 'out', gate: '西门', time: '2025-07-01 07:45:00', verifyMethod: 'face' },
  { id: 4, personName: '赵丽', personType: 'teacher', phone: '13900139001', direction: 'in', gate: '北门', time: '2025-07-01 09:15:00', verifyMethod: 'qr' },
  { id: 5, personName: '王伟', personType: 'visitor', phone: '13700137000', direction: 'out', gate: '东门', time: '2025-07-01 11:00:00', verifyMethod: 'face' },
  { id: 6, personName: '陈明', personType: 'visitor', phone: '13800138001', direction: 'in', gate: '南门', time: '2025-07-01 10:20:00', verifyMethod: 'card' },
])

const handleSearch = () => { pagination.page = 1 }
const resetSearch = () => {
  searchForm.name = ''
  searchForm.direction = ''
  searchForm.gate = ''
  searchForm.dateRange = null
  pagination.page = 1
}
const handleExport = () => {
  ElMessage.success('导出功能开发中...')
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.search-card { border-radius: 8px; }
.table-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
