import HomeView from '@/views/HomeView.vue'

export default {
    path: '/',
    name: 'home',
    meta: {
        keepElement: '.outer',
        keepAlive: true
    },
    component: HomeView
}       