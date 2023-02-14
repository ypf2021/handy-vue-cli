/** 长按压触发事件
 * @param {Function} bind.value ：长按压触发的函数
 * @param {string} bind.arg ：长按压的时间参数；
 */
// 使用方法：  <div class="test" v-longpress="fun"> hello</div>
// 设置按压触发的时间：  <div class="test" v-longpress:100="fun">hello</div>

export default {
    mounted(el, binding) {
        if (typeof binding.value !== 'function') {
            throw 'callback must be a function';
        }
        let pressTimer = null

        const start = (e) => {
            if (e.type === 'click' && e.button !== 0) {
                return;
            }
            if (pressTimer === null) {
                pressTimer = setTimeout(() => {
                    handle(e)
                }, binding.arg || 2000)
            }
        }

        const handle = (e) => {
            binding.value(e)
        }

        const cancel = () => {
            if (pressTimer !== null) {
                clearTimeout(pressTimer);
                pressTimer = null;
            }
        }


        // 添加事件监听器
        el.addEventListener('mousedown', start);
        el.addEventListener('touchstart', start);
        // 取消计时器
        el.addEventListener('click', cancel);
        el.addEventListener('mouseout', cancel);
        el.addEventListener('touchend', cancel);
        el.addEventListener('touchcancel', cancel);

    },
}


