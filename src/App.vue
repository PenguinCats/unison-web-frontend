<template>
  <div id="app">
    <n-message-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <router-view></router-view>
        </n-loading-bar-provider>
      </n-dialog-provider>
    </n-message-provider>
  </div>
</template>

<script>
export default {
  name: 'APP',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  created() {
    if (sessionStorage.getItem('store')) {
      this.$store.replaceState({ ...this.$store.state, ...JSON.parse(sessionStorage.getItem('store')) });
    }

    window.addEventListener('beforeunload', () => {
      sessionStorage.setItem('store', JSON.stringify(this.$store.state));
    });
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

html,
body,
#app {
  padding: 0;
  margin: 0;
  height: 100%;
  //display: flex;
  //flex-direction: column;
  background-color: rgb(250, 250, 250);
}
</style>
