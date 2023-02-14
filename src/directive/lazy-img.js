/** 图片懒加载
 * @param {string} bind.value ：图片的url；
 */
// 使用方法：
//  <img v-lazy-img="'https://www.keaidian.com/uploads/allimg/190424/24110307_23.jpg'" alt=""></img>


export default {
    beforeMount(el, binding) {
        el.$data_src = binding.value
    },
    mounted(el) {
        const io = new IntersectionObserver((entries) => {
            const realSrc = el.$data_src
            // 通过isIntersecting判断是否在可视区域内
            entries[0].isIntersecting && realSrc && (el.src = realSrc)
        })
        el.$io = io
        io.observe(el)
    },
    updated(el, binding) {
        // 实时更新图片的最新路径
        el.$data_src = binding.value
    },
    unmounted(el) {
        el.$io.disconnect()
    },
}









