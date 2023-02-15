import { addRouterHooks } from './hooks/index'
import { createRouter, createWebHistory } from 'vue-router'
import { importAll } from '@/utils/modules'

const routeModules = importAll(require.context('./modules', false, /\.js$/))
const routes = Object.values(routeModules)

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// 注册路由导航
addRouterHooks(router)

export default router
