

export default {
    path: '/',
    name: 'home',
    meta: {
        keepElement: '.outer',
        keepAlive: true
    },
    component: () => import(/* webpackChunkName: "HomeView" */ '@/views/HomeView.vue')

}       