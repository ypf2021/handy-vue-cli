import icon from './icon/icon-svg.vue'

// 这里是需要全局挂载的组件
export default {
    install(app) {
        app.component('VueIcon', icon)
    }
}