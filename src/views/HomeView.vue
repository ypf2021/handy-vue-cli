<template>
  <keep-alive>
    <div class="home">
      <img v-fixed:right="100" alt="Vue logo" src="../assets/logo.png" />
      <HelloWorld msg="Welcome to Your Vue.js App" />
      <el-button v-debounce="console">aaaaa</el-button>
      <div v-infinite-scroll="fun" class="outer">
        <div v-for="(item, index) in list" :key="index">{{ index }}</div>
      </div>
      <el-button v-longpress="longpress">长按</el-button>
    </div>
  </keep-alive>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import { keepScroll } from "@/mixin/keepScroll.js";
export default {
  name: "HomeView",
  components: {
    HelloWorld,
  },
  mixins: [keepScroll],
  data() {
    return {
      list: [
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ,
        1,
        1,
        1,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        11,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        1,
        ,
        1,
        1,
        1,
        11,
      ],
    };
  },
  methods: {
    console() {
      console.log(11);
    },
    fun() {
      this.list.push(2);
    },
    longpress() {
      console.log(1231231231);
    },
  },
};
</script>

<style scoped>
.outer {
  height: 200px;
  overflow-y: scroll;
}
</style>
