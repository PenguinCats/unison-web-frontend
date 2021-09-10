<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions"
  @update-value="handleMenuSelect"/>
</template>

<script>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

// eslint-disable-next-line import/no-extraneous-dependencies
import VirtualMachine from '@vicons/carbon/VirtualMachine';
// eslint-disable-next-line import/no-extraneous-dependencies
import CatchingPokemonFilled from '@vicons/material/CatchingPokemonFilled';
// eslint-disable-next-line import/no-extraneous-dependencies
import AllInboxFilled from '@vicons/material/AllInboxFilled';
// eslint-disable-next-line import/no-extraneous-dependencies
import HelpOutlineRound from '@vicons/material/HelpOutlineRound';

import { NIcon } from 'naive-ui';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  name: 'MenuComponent',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();
    const menuOptions = [
      {
        label: '主页',
        key: '/index',
        icon: renderIcon(CatchingPokemonFilled),
      },
      {
        label: '计算资源',
        key: '/resource',
        icon: renderIcon(VirtualMachine),
      },
      {
        label: '站内消息',
        key: '/inbox',
        icon: renderIcon(AllInboxFilled),
      },
      {
        label: '帮助手册',
        key: '/help',
        icon: renderIcon(HelpOutlineRound),
      },
    ];
    const activeKey = ref('/');
    const handleMenuSelect = (value) => {
      activeKey.value = value;
      router.push({
        path: value,
      });
    };
    return {
      menuOptions,
      activeKey,
      handleMenuSelect,
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
    };
  },
};
</script>

<style scoped>

</style>
