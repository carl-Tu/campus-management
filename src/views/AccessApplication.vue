<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="申请人">
          <el-input v-model="searchForm.applicant" placeholder="请输入申请人" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择" clearable>
            <el-option label="待审批" value="pending" />
            <el-option label="已通过" value="approved" />
            <el-option label="已拒绝" value="rejected" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 & 表格 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>申请列表</span>
          <el-button type="primary" @click="handleApply">
            <el-icon><Plus /></el-icon>发起申请
          </el-button>
        </div>
      </template>

      <el-table :data="applicationList" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="applicantName" label="申请人" min-width="90" />
        <el-table-column prop="applicantType" label="人员类型" min-width="90">
          <template #default="{ row }">
            <el-tag size="small">{{ typeLabel(row.applicantType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="reason" label="事由" min-width="140" show-overflow-tooltip />
        <el-table-column prop="targetArea" label="目标区域" min-width="100" />
        <el-table-column prop="applyTime" label="申请时间" min-width="150" />
        <el-table-column prop="expectedTime" label="预计时间" min-width="150" />
        <el-table-column prop="status" label="状态" min-width="90">
          <template #default="{ row }">
            <el-tag :type="statusType(row.status)">{{ statusLabel(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <template v-if="row.status === 'pending'">
              <el-button type="success" link size="small" @click="handleApprove(row)">通过</el-button>
              <el-button type="danger" link size="small" @click="handleReject(row)">拒绝</el-button>
            </template>
            <el-button type="primary" link size="small" @click="handleDetail(row)">详情</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.size"
        :page-sizes="[10, 20, 50]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        style="margin-top: 16px; justify-content: flex-end;"
      />
    </el-card>

    <!-- 发起申请对话框 -->
    <el-dialog v-model="applyDialogVisible" title="发起出入申请" width="550px">
      <el-form ref="applyFormRef" :model="applyForm" :rules="applyRules" label-width="90px">
        <el-form-item label="申请人" prop="applicantName">
          <el-input v-model="applyForm.applicantName" placeholder="请输入申请人姓名" />
        </el-form-item>
        <el-form-item label="人员类型" prop="applicantType">
          <el-select v-model="applyForm.applicantType" placeholder="请选择" style="width: 100%">
            <el-option label="访客" value="visitor" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="校园管理者" value="manager" />
          </el-select>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="applyForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="事由" prop="reason">
          <el-input v-model="applyForm.reason" type="textarea" rows="3" placeholder="请输入出入事由" />
        </el-form-item>
        <el-form-item label="目标区域" prop="targetArea">
          <el-input v-model="applyForm.targetArea" placeholder="请输入目标区域" />
        </el-form-item>
        <el-form-item label="预计时间" prop="expectedTime">
          <el-date-picker v-model="applyForm.expectedTime" type="datetime" placeholder="请选择预计出入时间" style="width: 100%" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="applyDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitApplication">提交</el-button>
      </template>
    </el-dialog>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailDialogVisible" title="申请详情" width="500px">
      <el-descriptions :column="1" border v-if="currentDetail">
        <el-descriptions-item label="申请人">{{ currentDetail.applicantName }}</el-descriptions-item>
        <el-descriptions-item label="人员类型">{{ typeLabel(currentDetail.applicantType) }}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{ currentDetail.phone }}</el-descriptions-item>
        <el-descriptions-item label="事由">{{ currentDetail.reason }}</el-descriptions-item>
        <el-descriptions-item label="目标区域">{{ currentDetail.targetArea }}</el-descriptions-item>
        <el-descriptions-item label="申请时间">{{ currentDetail.applyTime }}</el-descriptions-item>
        <el-descriptions-item label="预计时间">{{ currentDetail.expectedTime }}</el-descriptions-item>
        <el-descriptions-item label="状态">
          <el-tag :type="statusType(currentDetail.status)">{{ statusLabel(currentDetail.status) }}</el-tag>
        </el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.reviewer" label="审核人">{{ currentDetail.reviewer }}</el-descriptions-item>
        <el-descriptions-item v-if="currentDetail.remark" label="备注">{{ currentDetail.remark }}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { AccessApplication, VisitorType } from '@/types'

const typeMap: Record<VisitorType, string> = { visitor: '访客', teacher: '教师', student: '学生', manager: '校园管理者' }
const typeLabel = (t: VisitorType) => typeMap[t] || t
const statusMap: Record<string, string> = { pending: '待审批', approved: '已通过', rejected: '已拒绝' }
const statusTypeMap: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
const statusLabel = (s: string) => statusMap[s] || s
const statusType = (s: string) => statusTypeMap[s] || 'info'

/* 搜索 */
const searchForm = reactive({ applicant: '', status: '' })
const pagination = reactive({ page: 1, size: 10, total: 5 })

/* 列表数据 */
const applicationList = ref<AccessApplication[]>([
  { id: 1, applicantName: '王访客', applicantType: 'visitor', phone: '13700137000', reason: '面试', targetArea: '综合楼', applyTime: '2025-07-01 09:00', expectedTime: '2025-07-01 10:00', status: 'pending' },
  { id: 2, applicantName: '张老师', applicantType: 'teacher', phone: '13900139000', reason: '出差返回', targetArea: '计算机学院', applyTime: '2025-07-01 08:30', expectedTime: '2025-07-01 09:00', status: 'approved', reviewer: '管理员', reviewTime: '2025-07-01 08:35' },
  { id: 3, applicantName: '李同学', applicantType: 'student', phone: '15000150000', reason: '家长来访', targetArea: '宿舍区', applyTime: '2025-06-30 14:00', expectedTime: '2025-07-01 14:00', status: 'approved', reviewer: '管理员', reviewTime: '2025-06-30 14:10' },
  { id: 4, applicantName: '赵访客', applicantType: 'visitor', phone: '13600136000', reason: '送货', targetArea: '食堂', applyTime: '2025-06-30 10:00', expectedTime: '2025-06-30 11:00', status: 'rejected', reviewer: '管理员', remark: '未提前报备' },
  { id: 5, applicantName: '刘老师', applicantType: 'teacher', phone: '13100131000', reason: '学术交流', targetArea: '图书馆', applyTime: '2025-06-29 16:00', expectedTime: '2025-06-30 09:00', status: 'approved', reviewer: '管理员', reviewTime: '2025-06-29 16:05' },
])

/* 新增申请表单 */
const applyDialogVisible = ref(false)
const applyFormRef = ref<FormInstance>()
const applyForm = reactive({
  applicantName: '', applicantType: '' as VisitorType | '', phone: '',
  reason: '', targetArea: '', expectedTime: '',
})
const applyRules: FormRules = {
  applicantName: [{ required: true, message: '请输入申请人', trigger: 'blur' }],
  applicantType: [{ required: true, message: '请选择人员类型', trigger: 'change' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  reason: [{ required: true, message: '请输入事由', trigger: 'blur' }],
  targetArea: [{ required: true, message: '请输入目标区域', trigger: 'blur' }],
  expectedTime: [{ required: true, message: '请选择时间', trigger: 'change' }],
}

/* 详情 */
const detailDialogVisible = ref(false)
const currentDetail = ref<AccessApplication | null>(null)

const handleSearch = () => { pagination.page = 1 }
const resetSearch = () => { searchForm.applicant = ''; searchForm.status = ''; pagination.page = 1 }

const handleApply = () => {
  applyForm.applicantName = ''
  applyForm.applicantType = ''
  applyForm.phone = ''
  applyForm.reason = ''
  applyForm.targetArea = ''
  applyForm.expectedTime = ''
  applyDialogVisible.value = true
}

const submitApplication = async () => {
  if (!applyFormRef.value) return
  await applyFormRef.value.validate((valid) => {
    if (valid) {
      const newApp: AccessApplication = {
        id: Date.now(),
        applicantName: applyForm.applicantName,
        applicantType: applyForm.applicantType as VisitorType,
        phone: applyForm.phone,
        reason: applyForm.reason,
        targetArea: applyForm.targetArea,
        applyTime: new Date().toLocaleString(),
        expectedTime: applyForm.expectedTime as string,
        status: 'pending',
      }
      applicationList.value.unshift(newApp)
      pagination.total++
      applyDialogVisible.value = false
      ElMessage.success('申请已提交')
    }
  })
}

const handleApprove = (row: AccessApplication) => {
  row.status = 'approved'
  row.reviewer = '管理员'
  row.reviewTime = new Date().toLocaleString()
  ElMessage.success('已通过')
}

const handleReject = (row: AccessApplication) => {
  row.status = 'rejected'
  row.reviewer = '管理员'
  row.reviewTime = new Date().toLocaleString()
  ElMessage.info('已拒绝')
}

const handleDetail = (row: AccessApplication) => {
  currentDetail.value = row
  detailDialogVisible.value = true
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.search-card { border-radius: 8px; }
.table-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
