<template>
  <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav>
  <!-- <router-view></router-view> -->

  <router-view v-slot="{ Component }">
    <keep-alive include="HomeView">
      <component :is="Component"></component>
    </keep-alive>
  </router-view>
</template>

<script>
export default {
  mounted() {
    this.$api.homeApi.getMsg().then((result) => {
      console.log(result, 111);
    });
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: $highlight-color;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>

