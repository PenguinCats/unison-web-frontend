<template>
  <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions"
  @update-value="handleMenuSelect"/>
</template>

<script lang="ts">
import {
  computed, h, ref,
} from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

// eslint-disable-next-line import/no-extraneous-dependencies
import VirtualMachine from '@vicons/carbon/VirtualMachine';
// eslint-disable-next-line import/no-extraneous-dependencies
import CatchingPokemonFilled from '@vicons/material/CatchingPokemonFilled';
// eslint-disable-next-line import/no-extraneous-dependencies
import AllInboxFilled from '@vicons/material/AllInboxFilled';
// eslint-disable-next-line import/no-extraneous-dependencies
import HelpOutlineRound from '@vicons/material/HelpOutlineRound';
// eslint-disable-next-line import/no-extraneous-dependencies
import UserMultiple from '@vicons/carbon/UserMultiple';

import { NIcon } from 'naive-ui';

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  name: 'MenuComponent',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();
    const store = useStore();

    const isAdmin = computed((): boolean => store.getters.isAdmin);
    const menuOptions = computed(() => {
      const menuList = [
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
          label: '帮助手册',
          key: '/help',
          icon: renderIcon(HelpOutlineRound),
        },
        {
          label: '站内消息',
          key: '/message',
          icon: renderIcon(AllInboxFilled),
        },
      ];

      if (isAdmin.value) {
        menuList.push({
          label: '用户及权限管理',
          key: '/user',
          icon: renderIcon(UserMultiple),
        });
      }

      return menuList;
    });
    const activeKey = ref('/');
    const handleMenuSelect = (value: string) => {
      activeKey.value = value;
      router.push({
        path: value,
      });
    };

    // const { uid } = store.state.uid;
    // const profileLoading = true;
    // const profileForm = {
    //   name: '',
    //   authority: '',
    //   seu_id: '',
    // };
    // onMounted(async () => {
    //   const { data: res } = await axios.post('/user/profile', {
    //     uid,
    //   });
    //   profileForm.name = res.data.name;
    //   profileForm.authority = res.data.authority;
    //   profileForm.seu_id = res.data.seu_id;
    // });

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
