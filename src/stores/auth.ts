import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { UserInfo } from '@/types'

/* 认证状态管理 */
export const useAuthStore = defineStore('auth', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<UserInfo | null>(null)

  /* 初始化模拟数据 */
  const initMockData = () => {
    const users: UserInfo[] = [
      {
        id: 1,
        username: 'admin',
        realName: '系统管理员',
        phone: '13800138000',
        role: 'admin',
        department: '信息中心',
        status: 'active',
        createTime: '2024-01-01',
      },
    ]
    localStorage.setItem('users', JSON.stringify(users))
  }

  /* 登录 */
  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === '123456') {
      token.value = 'mock-token-' + Date.now()
      localStorage.setItem('token', token.value)
      userInfo.value = {
        id: 1,
        username: 'admin',
        realName: '系统管理员',
        phone: '13800138000',
        role: 'admin',
        department: '信息中心',
        status: 'active',
        createTime: '2024-01-01',
      }
      localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      return true
    }
    return false
  }

  /* 登出 */
  const logout = () => {
    token.value = ''
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  /* 恢复用户信息 */
  const restoreUser = () => {
    const saved = localStorage.getItem('userInfo')
    if (saved) {
      userInfo.value = JSON.parse(saved)
    }
  }

  /* 初始化 */
  initMockData()
  if (token.value) {
    restoreUser()
  }

  return { token, userInfo, login, logout, restoreUser }
})
