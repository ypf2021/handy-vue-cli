import config from "@/config/myConfig";
import { isAuthenticated } from "@/utils/login";
import Storage from "@/utils/storage";

export function addRouterHooks(router) {
    // 全局路由守卫
    router.beforeEach(async (to) => {
        console.log("login beforeEach");
        const hashTitle = to.meta.title;
        document.title = hashTitle ? hashTitle : "项目名";
        if (!config.useBeforeEach) {
            return;
        }
        // 检查 to的页面是否需要认证，再判断是否有 token ，避免无限重定向
        if ((to.meta.requireAuth && isAuthenticated()) || to.name !== "Login") {
            return { name: "Login" };
        }
    });

    // 缓存 滑动位置 导航
    router.beforeEach((to, from) => {
        if (!from.meta.keepAlive || !from.meta.keepElement) {
        } else {
            const $content = document.querySelector(from.meta.keepElement);
            const scrollTop = $content ? $content.scrollTop : 0;
            console.log("$content:", $content);
            console.log("scrollTop:", scrollTop);
            Storage.setItem("scrollVal", scrollTop);
        }
    });
}
