<template>
  <div class="page-container">
    <!-- 搜索栏 -->
    <el-card shadow="never" class="search-card">
      <el-form :inline="true" :model="searchForm">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="请选择角色" clearable>
            <el-option label="管理员" value="admin" />
            <el-option label="校园管理者" value="manager" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="访客" value="visitor" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="正常" value="active" />
            <el-option label="禁用" value="disabled" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 操作栏 -->
    <el-card shadow="never" class="table-card">
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>新增用户
          </el-button>
        </div>
      </template>

      <!-- 数据表格 -->
      <el-table :data="userList" stripe border style="width: 100%">
        <el-table-column prop="id" label="ID" min-width="60" />
        <el-table-column prop="username" label="用户名" min-width="100" />
        <el-table-column prop="realName" label="真实姓名" min-width="100" />
        <el-table-column prop="phone" label="手机号" min-width="120" />
        <el-table-column prop="role" label="角色" min-width="90">
          <template #default="{ row }">
            <el-tag :type="roleTagType(row.role)">{{ roleLabel(row.role) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="department" label="部门" min-width="110" />
        <el-table-column prop="status" label="状态" min-width="80">
          <template #default="{ row }">
            <el-tag :type="row.status === 'active' ? 'success' : 'danger'">
              {{ row.status === 'active' ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="110" />
        <el-table-column label="操作" fixed="right" width="200">
          <template #default="{ row }">
            <el-button type="primary" link size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" link size="small" @click="handleToggle(row)">
              {{ row.status === 'active' ? '禁用' : '启用' }}
            </el-button>
            <el-button type="danger" link size="small" @click="handleDelete(row)">删除</el-button>
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

    <!-- 新增/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="realName">
          <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone" placeholder="请输入手机号" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-select v-model="userForm.role" placeholder="请选择角色" style="width: 100%">
            <el-option label="管理员" value="admin" />
            <el-option label="校园管理者" value="manager" />
            <el-option label="教师" value="teacher" />
            <el-option label="学生" value="student" />
            <el-option label="访客" value="visitor" />
          </el-select>
        </el-form-item>
        <el-form-item label="部门" prop="department">
          <el-input v-model="userForm.department" placeholder="请输入部门" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import type { UserInfo } from '@/types'

/* 角色映射 */
const roleLabel = (role: string) => {
  const map: Record<string, string> = { admin: '管理员', manager: '校园管理者', teacher: '教师', student: '学生', visitor: '访客' }
  return map[role] || role
}
const roleTagType = (role: string) => {
  const map: Record<string, string> = { admin: 'danger', manager: 'warning', teacher: '', student: 'success', visitor: 'info' }
  return map[role] || 'info'
}

/* 搜索表单 */
const searchForm = reactive({ username: '', role: '', status: '' })

/* 分页 */
const pagination = reactive({ page: 1, size: 10, total: 3 })

/* 用户列表（模拟数据） */
const userList = ref<UserInfo[]>([
  { id: 1, username: 'admin', realName: '系统管理员', phone: '13800138000', role: 'admin', department: '信息中心', status: 'active', createTime: '2024-01-01' },
  { id: 2, username: 'teacher01', realName: '张老师', phone: '13900139000', role: 'teacher', department: '计算机学院', status: 'active', createTime: '2024-02-15' },
  { id: 3, username: 'student01', realName: '李同学', phone: '15000150000', role: 'student', department: '软件工程', status: 'active', createTime: '2024-03-10' },
])

/* 对话框 */
const dialogVisible = ref(false)
const dialogTitle = ref('新增用户')
const isEdit = ref(false)
const userFormRef = ref<FormInstance>()
const userForm = reactive({
  id: 0, username: '', realName: '', phone: '', role: '', department: '',
})
const userRules: FormRules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  realName: [{ required: true, message: '请输入真实姓名', trigger: 'blur' }],
  phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }],
  role: [{ required: true, message: '请选择角色', trigger: 'change' }],
}

const resetForm = () => {
  userForm.id = 0
  userForm.username = ''
  userForm.realName = ''
  userForm.phone = ''
  userForm.role = ''
  userForm.department = ''
}

const handleSearch = () => { pagination.page = 1 }
const resetSearch = () => {
  searchForm.username = ''
  searchForm.role = ''
  searchForm.status = ''
  pagination.page = 1
}

const handleAdd = () => {
  resetForm()
  dialogTitle.value = '新增用户'
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (row: UserInfo) => {
  Object.assign(userForm, row)
  dialogTitle.value = '编辑用户'
  isEdit.value = true
  dialogVisible.value = true
}

const handleToggle = (row: UserInfo) => {
  row.status = row.status === 'active' ? 'disabled' : 'active'
  ElMessage.success(`已${row.status === 'active' ? '启用' : '禁用'}`)
}

const handleDelete = (row: UserInfo) => {
  ElMessageBox.confirm(`确定删除用户 "${row.realName}" 吗？`, '提示', { type: 'warning' })
    .then(() => {
      userList.value = userList.value.filter((u) => u.id !== row.id)
      ElMessage.success('删除成功')
    })
    .catch(() => {})
}

const handleSubmit = async () => {
  if (!userFormRef.value) return
  await userFormRef.value.validate((valid) => {
    if (valid) {
      if (isEdit.value) {
        const idx = userList.value.findIndex((u) => u.id === userForm.id)
        if (idx >= 0) {
          userList.value[idx] = { ...userList.value[idx], ...userForm } as UserInfo
        }
        ElMessage.success('编辑成功')
      } else {
        const newUser: UserInfo = {
          ...userForm,
          id: Date.now(),
          status: 'active',
          createTime: new Date().toISOString().split('T')[0],
        } as UserInfo
        userList.value.push(newUser)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
    }
  })
}
</script>

<style scoped>
.page-container { display: flex; flex-direction: column; gap: 16px; }
.search-card { border-radius: 8px; }
.table-card { border-radius: 8px; }
.card-header { display: flex; justify-content: space-between; align-items: center; }
</style>
