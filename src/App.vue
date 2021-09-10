<template>
  <div id="app">
    <n-layout-header bordered>
      <n-grid x-gap="12" :cols="4">
        <n-gi span="1" style="width: 100%">
          Logo
        </n-gi>
        <n-gi span="2" style="width: 100%">
          <MenuComponent></MenuComponent>
        </n-gi>
        <n-gi span="1">
          UserComponent
        </n-gi>
      </n-grid>
    </n-layout-header>
    <router-view></router-view>
    <n-layout-footer bordered>
      <span>UEC V0.1.0 · Made by Binjie Zhang</span>
    </n-layout-footer>
  </div>
</template>

<script>

import MenuComponent from '@/components/Menu/MenuComponent.vue';

export default {
  components: { MenuComponent },
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
  display: flex;
  flex-direction: column;
}

//.layout {
//  height:100vh;
//  margin:0;
//  display:flex;
//  flex-direction:column;
//  background-color: silver;
//}

.n-layout-header {
  height: 64px;
  padding: 12px;
}

.content {
  padding-bottom: 60px;
}

.n-layout-footer {
  height: 64px;
  margin-top:auto;
  width: 100%;
  padding: 20px;
  background: rgba(128, 128, 128, 0.2);
  span {
    transition: color .3s var(--bezier);
    color: rgb(158, 164, 170);
  }
}

</style>
