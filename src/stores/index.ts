import { createPinia } from 'pinia'

const pinia = createPinia()

export default pinia
export { useAuthStore } from './auth'
export { useTabsStore } from './tabs'
