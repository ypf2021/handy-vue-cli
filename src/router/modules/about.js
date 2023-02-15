export default {
    path: '/about',
    name: 'about',
    meta: {
        title: "主页"
    },
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue')
}