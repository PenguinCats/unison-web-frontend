<template>
  <div id="app">
    <n-message-provider>
      <router-view></router-view>
    </n-message-provider>
  </div>
</template>

<script>

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
