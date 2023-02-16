import Storage from '@/utils/storage'
export const keepScroll = {
    activated() {
        const scrollTop = Storage.getItem("scrollVal")
        const $content = document.querySelector(this.$route.meta.keepElement);
        if (scrollTop && $content) {
            $content.scrollTop = scrollTop;
        }
        Storage.removeItem("scrollVal")
    },
};
