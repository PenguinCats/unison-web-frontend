<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
</template>

<script>
import { h, ref } from 'vue';

import {
  CatchingPokemonFilled,
  AllInboxFilled,
  HelpOutlineRound,
} from '@vicons/material';

import {
  VirtualMachine,
} from '@vicons/carbon';

import { NIcon } from 'naive-ui';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = [
  {
    label: () => h(
      'a',
      {
        href: 'https://baike.baidu.com/item/%E4%B8%94%E5%90%AC%E9%A3%8E%E5%90%9F',
        target: '_blank',
        rel: 'noopenner noreferrer',
      },
      '主页',
    ),
    key: 'index',
    icon: renderIcon(CatchingPokemonFilled),
  },
  {
    label: '计算实例',
    key: 'instance',
    icon: renderIcon(VirtualMachine),
  },
  {
    label: '站内消息',
    key: 'inbox',
    icon: renderIcon(AllInboxFilled),
  },
  {
    label: '帮助手册',
    key: 'help',
    icon: renderIcon(HelpOutlineRound),
  },
];

export default {
  name: 'MenuComponent',
  data() {
    return {
      activeKey: ref(null),
      menuOptions,
    };
  },
};
</script>

<style scoped>

</style>
