/** 让元素固定在页面的某个位置
 * @param {number} bind.value ：元素距离某个位置（默认是顶部）的距离
 * @param {string} bind.arg ：设置元素的定位，默认是顶部；
 */
// 使用方式：
// 基本用法：<div class="test" v-fixed>hello</div>
// 修改位置距离：<div class="test" v-fixed="1000">hello</div>
// 修改位置参数：<div class="test" v-fixed:left="1000">hello</div>

export default {
    mounted(el, binding) {
        el.style.position = 'fixed'
        const position = binding.arg || 'top'
        el.style[position] = binding.value + 'px'  
    },
    updated(el, binding) {
        const position = binding.arg || 'top'
        el.style[position] = binding.value + 'px'  
    }
}