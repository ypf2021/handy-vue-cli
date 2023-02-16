import { localGet, localRemove } from '@/utils/storage'
export const keepScroll = {
    activated() {
        console.log(this.$route)

        const scrollTop = localGet("scrollVal")
        // const scrollTop = this.$route.meta.scrollTop;
        const $content = document.querySelector(this.$route.meta.keepElement);
        console.log(111, scrollTop, $content)
        if (scrollTop && $content) {
            $content.scrollTop = scrollTop;
            console.log(111)
        }
        localRemove("scrollVal")
    },
};
