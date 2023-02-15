import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store';

// element
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css'

// 挂在axios方法
import api from './api/api'

// 导入全局组件
import component from './components/components'
// 导入svg
import './assets/icon/index.js'

// 自定义指令
import directive from './directive/index'

// 引入mock
import './mock/index'
const app = createApp(App)

app.config.globalProperties.$api = api

app.use(router).use(store).use(component).use(ElementPlus).use(directive).mount('#app')
