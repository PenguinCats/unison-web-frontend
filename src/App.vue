<template>
  <div id="app">
    <n-layout>
      <n-layout-header>
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
      <n-layout-content content-style="padding: 24px;">平山道</n-layout-content>
      <n-layout-footer>成府路</n-layout-footer>
    </n-layout>
  </div>
<!--  <n-layout>-->
<!--    <n-layout-header>-->
<!--      <n-grid x-gap="12" :cols="4">-->
<!--        <n-gi span="3">-->
<!--          Nav-->
<!--        </n-gi>-->
<!--        <n-gi span="1">-->
<!--          UserComponent-->
<!--        </n-gi>-->
<!--      </n-grid>-->
<!--    </n-layout-header>-->
<!--    <n-layout-content content-style="padding: 24px;">平山道</n-layout-content>-->
<!--    <n-layout-footer>成府路</n-layout-footer>-->
<!--  </n-layout>-->
<!--  <div id="nav">-->
<!--    <router-link to="/">Home</router-link> |-->
<!--    <router-link to="/about">About</router-link>-->
<!--  </div>-->
<!--  <router-view/>-->
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
  color: #2c3e50;
}

.n-layout-header,
.n-layout-footer {
  background: rgba(128, 128, 128, 0.2);
  padding: 24px;
}

.n-layout-sider {
  background: rgba(128, 128, 128, 0.3);
}

.n-layout-content {
  background: rgba(128, 128, 128, 0.4);
}
</style>
