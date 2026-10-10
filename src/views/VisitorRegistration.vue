<template>
  <div class="page-container">
    <!-- 访客登记表单 -->
    <el-card shadow="never" class="form-card">
      <template #header>
        <div class="card-header">
          <span>访客登记</span>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="visitorForm"
        :rules="formRules"
        label-width="100px"
        style="max-width: 600px;"
      >
        <el-form-item label="姓名" prop="name">
          <el-input v-model="visitorForm.name" placeholder="请输入姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="visitorForm.phone" placeholder="请输入手机号" maxlength="11" />
        </el-form-item>
        <el-form-item label="访客类型" prop="visitorType">
          <el-select v-model="visitorForm.visitorType" placeholder="请选择访客类型" style="width: 100%;">
            <el-option label="访客" value="visitor" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="校园管理者" value="manager" />
          </el-select>
        </el-form-item>
        <el-form-item label="身份证号">
          <el-input v-model="visitorForm.idCard" placeholder="请输入身份证号（选填）" />
        </el-form-item>
        <el-form-item label="来访事由">
          <el-input v-model="visitorForm.reason" type="textarea" rows="3" placeholder="请输入来访事由" />
        </el-form-item>
        <el-form-item label="对接人">
          <el-input v-model="visitorForm.targetPerson" placeholder="请输入校内对接人" />
        </el-form-item>
        <el-form-item label="预计到访">
          <el-date-picker v-model="visitorForm.expectTime" type="datetime" placeholder="选择时间" style="width: 100%;" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSubmit">登记</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 今日访客列表 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>今日访客记录</span>
          <el-tag type="info">共 {{ todayVisitors.length }} 条</el-tag>
        </div>
      </template>

      <el-table :data="todayVisitors" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="name" label="姓名" min-width="80" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="visitorType" label="访客类型" min-width="90">
          <template #default="{ row }">
            <el-tag :type="typeTagType(row.visitorType)" size="small">{{ typeLabel(row.visitorType) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="reason" label="来访事由" min-width="140" show-overflow-tooltip />
        <el-table-column prop="targetPerson" label="对接人" min-width="80" />
        <el-table-column prop="registerTime" label="登记时间" min-width="150" />
        <el-table-column label="操作" fixed="right" width="100">
          <template #default="{ row }">
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { VisitorForm, VisitorType } from '@/types'

/* 用于列表展示的扩展类型 */
interface VisitorRecord extends VisitorForm {
  id: number
  registerTime: string
}

const typeMap: Record<VisitorType, string> = { visitor: '访客', teacher: '教师', student: '学生', manager: '校园管理者' }
const typeTagMap: Record<VisitorType, string> = { visitor: 'info', teacher: '', student: 'success', manager: 'warning' }
const typeLabel = (t: VisitorType) => typeMap[t] || t
const typeTagType = (t: VisitorType) => typeTagMap[t] || 'info'

/* 表单 */
const formRef = ref<FormInstance>()
const visitorForm = reactive<VisitorForm>({
  name: '',
  phone: '',
  visitorType: '' as unknown as VisitorType,
  idCard: '',
  reason: '',
  targetPerson: '',
  expectTime: '',
})

const phoneValidator = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
  if (!value) { callback(new Error('请输入手机号')); return }
  if (!/^1[3-9]\d{9}$/.test(value)) { callback(new Error('手机号格式不正确')); return }
  callback()
}

const formRules: FormRules = {
  name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
  phone: [{ required: true, validator: phoneValidator, trigger: 'blur' }],
  visitorType: [{ required: true, message: '请选择访客类型', trigger: 'change' }],
}

/* 今日访客列表（模拟数据） */
const todayVisitors = ref<VisitorRecord[]>([
  { id: 1, name: '王伟', phone: '13700137000', visitorType: 'visitor', reason: '面试', targetPerson: '张老师', registerTime: '2025-07-01 09:00:00' },
  { id: 2, name: '陈明', phone: '13800138001', visitorType: 'visitor', reason: '送快递', targetPerson: '李同学', registerTime: '2025-07-01 09:30:00' },
  { id: 3, name: '赵丽', phone: '13900139001', visitorType: 'teacher', reason: '学术交流', targetPerson: '刘教授', registerTime: '2025-07-01 10:00:00' },
])

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      const record: VisitorRecord = {
        ...visitorForm,
        id: Date.now(),
        registerTime: new Date().toLocaleString(),
      }
      todayVisitors.value.unshift(record)
      ElMessage.success('访客登记成功')
      resetForm()
    }
  })
}

const resetForm = () => {
  formRef.value?.resetFields()
  visitorForm.idCard = ''
  visitorForm.reason = ''
  visitorForm.targetPerson = ''
  visitorForm.expectTime = ''
}

const handleDelete = (row: VisitorRecord) => {
  ElMessageBox.confirm(`确定删除 "${row.name}" 的登记记录吗？`, '提示', { type: 'warning' })
    .then(() => {
      todayVisitors.value = todayVisitors.value.filter((v) => v.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.form-card { border-radius: 8px; }
.table-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
