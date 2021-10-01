<template>
  <n-layout-header bordered>
    <n-grid x-gap="12" :cols="4">
      <n-gi span="1" style="width: 100%">
        <n-space>
          <img :src="urcp_logo_img_url" class="logo" alt="URCP logo">
          <i class="web-font"> URCP </i>
        </n-space>
      </n-gi>
      <n-gi span="2" style="width: 100%">
        <MenuComponent></MenuComponent>
      </n-gi>
      <n-gi span="1">
        <UserComponent></UserComponent>
      </n-gi>
    </n-grid>
  </n-layout-header>
  <router-view></router-view>
  <n-divider></n-divider>
  <n-layout-footer>
    <span>UEC V0.1.0 · Made by Binjie Zhang</span>
  </n-layout-footer>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import MenuComponent from '@/components/Menu/MenuComponent.vue';
import UserComponent from '@/components/UserBar/UserBar.vue';

export default defineComponent({
  name: 'Frame',
  components: { MenuComponent, UserComponent },
  setup() {
    return {
      // eslint-disable-next-line global-require
      urcp_logo_img_url: require('../../assets/logo_pure.png'),
    };
  },
});
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

.logo {
  //border-radius: 50%;
  height: 42px;
  width: 53px;
}

@font-face {
  font-family: 'webfont';
  font-display: swap;
  src: url('//at.alicdn.com/t/webfont_3ponpjs1naa.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_3ponpjs1naa.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.woff2') format('woff2'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.woff') format('woff'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.ttf') format('truetype'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.svg#Alibaba-PuHuiTi-Regular') format('svg');
}

.web-font{
  font-family:"webfont",serif !important;
  font-size:28px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;
  line-height: 42px;
}
</style>
