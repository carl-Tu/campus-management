import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { RouteLocationNormalized } from 'vue-router'

/* 标签页项类型 */
export interface TabItem {
  path: string
  title: string
  name: string
}

/* 标签页状态管理 */
export const useTabsStore = defineStore('tabs', () => {
  /* 已访问的路由标签列表 */
  const visitedRoutes = ref<TabItem[]>([])

  /* 当前激活的标签 */
  const activeTab = ref('')

  /* 添加标签（去重） */
  const addTab = (route: RouteLocationNormalized) => {
    /* 已存在则不重复添加 */
    if (visitedRoutes.value.some((t) => t.path === route.path)) {
      activeTab.value = route.path
      return
    }

    /* 首页始终放在第一个 */
    const tab: TabItem = {
      path: route.path,
      title: (route.meta.title as string) || '未命名',
      name: route.name as string,
    }

    if (route.path === '/') {
      visitedRoutes.value.unshift(tab)
    } else {
      visitedRoutes.value.push(tab)
    }

    activeTab.value = route.path
  }

  /* 关闭标签 */
  const removeTab = (path: string): string => {
    const idx = visitedRoutes.value.findIndex((t) => t.path === path)
    if (idx === -1) return activeTab.value

    visitedRoutes.value.splice(idx, 1)

    /* 如果关闭的是当前激活的标签，自动跳转 */
    if (activeTab.value === path) {
      const nextTab = visitedRoutes.value[idx] || visitedRoutes.value[idx - 1]
      activeTab.value = nextTab ? nextTab.path : '/'
    }

    return activeTab.value
  }

  /* 关闭其他标签 */
  const removeOtherTabs = (path: string) => {
    visitedRoutes.value = visitedRoutes.value.filter(
      (t) => t.path === path || t.path === '/',
    )
    activeTab.value = path
  }

  /* 关闭所有标签 */
  const removeAllTabs = () => {
    visitedRoutes.value = []
    activeTab.value = '/'
  }

  /* 设置当前激活标签 */
  const setActiveTab = (path: string) => {
    activeTab.value = path
  }

  return {
    visitedRoutes,
    activeTab,
    addTab,
    removeTab,
    removeOtherTabs,
    removeAllTabs,
    setActiveTab,
  }
})
