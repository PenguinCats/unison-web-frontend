<template>
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
  <n-divider></n-divider>
  <n-layout-footer>
    <span>UEC V0.1.0 · Made by Binjie Zhang</span>
  </n-layout-footer>
</template>

<script>
import MenuComponent from '@/components/Menu/MenuComponent.vue';

export default {
  name: 'Frame',
  components: { MenuComponent },
};
</script>

<style scoped lang="less">

.n-layout-header {
  height: 64px;
  padding: 12px;
  margin-bottom: 20px;
}

.content {
  padding-bottom: 60px;
}

.n-layout-footer {
  width: 100%;
  margin-bottom: 24px;
//height: 64px;
//margin-top:auto;
//padding: 20px;
//background: rgba(128, 128, 128, 0.2);
  span {
    transition: color .3s var(--bezier);
    color: rgb(158, 164, 170);
  }
}
</style>
