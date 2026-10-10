import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

/* 路由配置 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Login.vue'),
    meta: { title: '登录', requiresAuth: false },
  },
  {
    path: '/',
    component: () => import('@/views/Layout.vue'),
    redirect: '/visitor-registration',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'user-management',
        name: 'UserManagement',
        component: () => import('@/views/UserManagement.vue'),
        meta: { title: '用户管理', icon: 'User' },
      },
      {
        path: 'role-management',
        name: 'RoleManagement',
        component: () => import('@/views/RoleManagement.vue'),
        meta: { title: '角色权限管理', icon: 'Lock' },
      },
      {
        path: 'access-application',
        name: 'AccessApplication',
        component: () => import('@/views/AccessApplication.vue'),
        meta: { title: '出入申请与审批', icon: 'Document' },
      },
      {
        path: 'visitor-registration',
        name: 'VisitorRegistration',
        component: () => import('@/views/VisitorRegistration.vue'),
        meta: { title: '访客登记', icon: 'Notebook' },
      },
      {
        path: 'access-records',
        name: 'AccessRecords',
        component: () => import('@/views/AccessRecords.vue'),
        meta: { title: '出入记录查询', icon: 'List' },
      },
      {
        path: 'exception-alert',
        name: 'ExceptionAlert',
        component: () => import('@/views/ExceptionAlert.vue'),
        meta: { title: '异常预警', icon: 'Warning' },
      },
      {
        path: 'statistics-report',
        name: 'StatisticsReport',
        component: () => import('@/views/StatisticsReport.vue'),
        meta: { title: '统计报表', icon: 'DataAnalysis' },
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

/* 路由守卫 */
router.beforeEach((to, _from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth !== false && !token) {
    next('/login')
  } else if (to.path === '/login' && token) {
    next('/')
  } else {
    next()
  }
})

export default router
