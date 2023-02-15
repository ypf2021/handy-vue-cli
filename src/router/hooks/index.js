import config from '@/config/myConfig'
import { isAuthenticated } from '@/utils/login'

export function addRouterHooks(router) {
    // 全局路由守卫
    router.beforeEach(async (to) => {
        const hashTitle = to.meta.title
        document.title = hashTitle ? hashTitle : "项目名"
        if (!config.useBeforeEach) {
            return
        }
        // 检查 to的页面是否需要认证，再判断是否有 token ，避免无限重定向
        if (to.meta.requireAuth && isAuthenticated() || to.name !== 'Login') {
            return { name: 'Login' }
        }
    })

}