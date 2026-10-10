<template>
  <el-container class="layout-container">
    <!-- 侧边栏 -->
    <el-aside :width="isCollapse ? '64px' : '220px'" class="layout-aside">
      <div class="logo">
        <el-icon :size="28" color="#409eff"><School /></el-icon>
        <span v-show="!isCollapse" class="logo-text">校园出入管理</span>
      </div>
      <el-menu
        :default-active="currentPath"
        :collapse="isCollapse"
        router
        background-color="#001529"
        text-color="#ffffffa6"
        active-text-color="#409eff"
        class="aside-menu"
      >
        <el-menu-item index="/visitor-registration">
          <el-icon><Notebook /></el-icon>
          <template #title>访客登记</template>
        </el-menu-item>
        <el-menu-item index="/access-application">
          <el-icon><Document /></el-icon>
          <template #title>出入申请与审批</template>
        </el-menu-item>
        <el-menu-item index="/access-records">
          <el-icon><List /></el-icon>
          <template #title>出入记录查询</template>
        </el-menu-item>
        <el-menu-item index="/user-management">
          <el-icon><User /></el-icon>
          <template #title>用户管理</template>
        </el-menu-item>
        <el-menu-item index="/role-management">
          <el-icon><Lock /></el-icon>
          <template #title>角色权限管理</template>
        </el-menu-item>
        <el-menu-item index="/exception-alert">
          <el-icon><Warning /></el-icon>
          <template #title>异常预警</template>
        </el-menu-item>
        <el-menu-item index="/statistics-report">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>统计报表</template>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <!-- 主内容区 -->
    <el-container>
      <!-- 顶部栏 -->
      <el-header class="layout-header">
        <div class="header-left">
          <el-icon
            class="collapse-btn"
            :size="20"
            @click="isCollapse = !isCollapse"
          >
            <Fold v-if="!isCollapse" />
            <Expand v-else />
          </el-icon>
        </div>
        <div class="header-right">
          <el-dropdown trigger="click">
            <span class="user-info">
              <el-avatar :size="32" :icon="UserFilled" />
              <span class="user-name">{{ authStore.userInfo?.realName || '未登录' }}</span>
              <el-icon><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="handleLogout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>

      <!-- 多标签页导航 -->
      <div class="tabs-bar" v-if="tabsStore.visitedRoutes.length > 0">
        <el-tabs
          v-model="tabsStore.activeTab"
          type="card"
          @tab-click="handleTabClick"
          @tab-remove="handleTabRemove"
        >
          <el-tab-pane
            v-for="tab in tabsStore.visitedRoutes"
            :key="tab.path"
            :label="tab.title"
            :name="tab.path"
            :closable="tab.path !== '/'"
          />
        </el-tabs>
        <el-dropdown trigger="click" class="tabs-actions">
          <el-icon class="tabs-actions-btn"><ArrowDown /></el-icon>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="handleCloseOthers">关闭其他</el-dropdown-item>
              <el-dropdown-item @click="handleCloseAll">关闭所有</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>

      <!-- 页面内容 -->
      <el-main class="layout-main">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" :key="$route.path" />
          </keep-alive>
        </router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { TabsPaneContext } from 'element-plus'
import { UserFilled } from '@element-plus/icons-vue'
import {
  School, Notebook, Document, List, User, Lock,
  Warning, DataAnalysis, Fold, Expand, ArrowDown, SwitchButton,
} from '@element-plus/icons-vue'
import { useAuthStore, useTabsStore } from '@/stores'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const tabsStore = useTabsStore()

const isCollapse = ref(false)

const currentPath = computed(() => route.path)

/* 监听路由变化，自动添加标签 */
watch(
  () => route.path,
  () => {
    if (route.meta.title) {
      tabsStore.addTab(route)
    }
  },
  { immediate: true },
)

/* 点击标签切换路由 */
const handleTabClick = (tab: TabsPaneContext) => {
  const path = tab.paneName as string
  if (path !== route.path) {
    router.push(path)
  }
}

/* 关闭标签 */
const handleTabRemove = (path: string) => {
  const nextPath = tabsStore.removeTab(path)
  if (nextPath !== route.path) {
    router.push(nextPath)
  }
}

/* 关闭其他标签 */
const handleCloseOthers = () => {
  tabsStore.removeOtherTabs(route.path)
}

/* 关闭所有标签 */
const handleCloseAll = () => {
  tabsStore.removeAllTabs()
  router.push('/')
}

const handleLogout = () => {
  authStore.logout()
  tabsStore.removeAllTabs()
  router.push('/login')
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.layout-aside {
  background-color: #001529;
  transition: width 0.3s;
  overflow: hidden;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-bottom: 1px solid #ffffff1a;
}

.logo-text {
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
}

.aside-menu {
  border-right: none;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0 20px;
  height: 50px;
  z-index: 2;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.collapse-btn {
  cursor: pointer;
  color: #606266;
}

.collapse-btn:hover {
  color: #409eff;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: #606266;
}

.user-name {
  font-size: 14px;
}

/* 标签栏 */
.tabs-bar {
  display: flex;
  align-items: center;
  background: #fff;
  padding: 4px 12px 0;
  border-bottom: 1px solid #e4e7ed;
  z-index: 1;
}

.tabs-bar :deep(.el-tabs) {
  flex: 1;
}

.tabs-bar :deep(.el-tabs__header) {
  margin: 0;
}

.tabs-bar :deep(.el-tabs__nav-wrap) {
  margin-bottom: 0;
}

.tabs-actions {
  margin-left: 8px;
  cursor: pointer;
  color: #606266;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}

.tabs-actions:hover {
  color: #409eff;
  border-color: #c6e2ff;
  background: #ecf5ff;
}

.layout-main {
  background: #f0f2f5;
  overflow-y: auto;
  padding: 16px;
}
</style>
