/** 无限滚动列表（滚动到底部触发事件）
 * @param {Function} bind.value ：滚动到底部触发的事件；
 */
// 使用方法：
//   <div id="outer" v-infinite-scroll="fun">
//      <div v-for="(item,index) in arr">{{index}}</div>
//   </div>
//     fun() {
//       this.arr.push('1')
//     },
// .outer {
//     height: 200px;
//     overflow: scroll;
//   }
export default {
    mounted(el, binding) {
        el.addEventListener('scroll', () => {
            console.log("scroll")
            // 可视区域中元素的content + padding
            const clientHeight = el.clientHeight;
            // 滚动了的高度
            const scrollTop = Math.round(el.scrollTop);
            // 元素可以滚动的高度
            const scrollHeight = el.scrollHeight;
            if (approximate(clientHeight, scrollTop, scrollHeight)) {
                binding.value?.();
            }
        });
    },
    unmounted(el) {
        // 停止监听工作
        el.removeEventListener('scroll', () => { });
    },
};
// 近似相等
function approximate(num1, num2, sum) {
    const sumArray = [num1 + num2, num1 + num2 + 1, num1 + num2 - 1];
    if (sumArray.indexOf(sum) !== -1) {
        return true;
    }
    return false;
}
