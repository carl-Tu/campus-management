<template>
  <div class="page-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span>角色列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增角色
          </el-button>
        </div>
      </template>

      <el-table :data="roleList" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="name" label="角色标识" min-width="110" />
        <el-table-column prop="label" label="角色名称" min-width="110" />
        <el-table-column label="权限列表" min-width="200">
          <template #default="{ row }">
            <el-tag
              v-for="perm in row.permissions"
              :key="perm"
              size="small"
              style="margin: 2px;"
            >{{ perm }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="220">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handlePermission(row)">分配权限</el-button>
            <el-button type="danger" link size="small" :disabled="row.name === 'admin'" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 新增/编辑角色对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="450px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="90px">
        <el-form-item label="角色标识" prop="name">
          <el-input v-model="formData.name" placeholder="如：admin" />
        </el-form-item>
        <el-form-item label="角色名称" prop="label">
          <el-input v-model="formData.label" placeholder="如：管理员" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>

    <!-- 权限分配对话框 -->
    <el-dialog v-model="permDialogVisible" title="分配权限" width="500px">
      <p style="margin-bottom: 12px; color: #606266;">为角色 <strong>{{ currentRole?.label }}</strong> 分配以下权限：</p>
      <el-checkbox-group v-model="selectedPermissions">
        <div v-for="perm in allPermissions" :key="perm" style="margin: 8px 0;">
          <el-checkbox :label="perm">{{ perm }}</el-checkbox>
        </div>
      </el-checkbox-group>
      <template #footer>
        <el-button @click="permDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="savePermissions">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { RoleInfo } from '@/types'

/* 所有可用权限 */
const allPermissions = [
  '用户管理', '角色管理', '出入申请审批',
  '访客登记', '记录查询', '异常预警', '统计报表',
]

/* 角色列表（模拟数据） */
const roleList = ref<RoleInfo[]>([
  { id: 1, name: 'admin', label: '管理员', permissions: allPermissions },
  { id: 2, name: 'manager', label: '校园管理者', permissions: ['出入申请审批', '访客登记', '记录查询', '异常预警', '统计报表'] },
  { id: 3, name: 'teacher', label: '教师', permissions: ['出入申请审批', '访客登记', '记录查询'] },
  { id: 4, name: 'student', label: '学生', permissions: ['访客登记', '记录查询'] },
  { id: 5, name: 'visitor', label: '访客', permissions: ['访客登记'] },
])

/* 角色表单 */
const dialogVisible = ref(false)
const dialogTitle = ref('新增角色')
const isEdit = ref(false)
const formRef = ref<FormInstance>()
const formData = reactive({ id: 0, name: '', label: '' })
const formRules: FormRules = {
  name: [{ required: true, message: '请输入角色标识', trigger: 'blur' }],
  label: [{ required: true, message: '请输入角色名称', trigger: 'blur' }],
}

/* 权限对话框 */
const permDialogVisible = ref(false)
const currentRole = ref<RoleInfo | null>(null)
const selectedPermissions = ref<string[]>([])

const handleAdd = () => {
  formData.id = 0
  formData.name = ''
  formData.label = ''
  dialogTitle.value = '新增角色'
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (row: RoleInfo) => {
  formData.id = row.id
  formData.name = row.name
  formData.label = row.label
  dialogTitle.value = '编辑角色'
  isEdit.value = true
  dialogVisible.value = true
}

const handlePermission = (row: RoleInfo) => {
  currentRole.value = row
  selectedPermissions.value = [...row.permissions]
  permDialogVisible.value = true
}

const savePermissions = () => {
  if (currentRole.value) {
    currentRole.value.permissions = [...selectedPermissions.value]
  }
  permDialogVisible.value = false
  ElMessage.success('权限分配成功')
}

const handleDelete = (row: RoleInfo) => {
  ElMessageBox.confirm(`确定删除角色 "${row.label}" 吗？`, '提示', { type: 'warning' })
    .then(() => {
      roleList.value = roleList.value.filter((r) => r.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSubmit = async () => {
  if (!formRef.value) return
  await formRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const idx = roleList.value.findIndex((r) => r.id === formData.id)
        if (idx >= 0) {
          roleList.value[idx].name = formData.name
          roleList.value[idx].label = formData.label
        }
        ElMessage.success('编辑成功')
      } else {
        roleList.value.push({
          id: Date.now(),
          name: formData.name,
          label: formData.label,
          permissions: [],
        })
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
