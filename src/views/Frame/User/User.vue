<template>
  <n-layout has-sider style="background-color: transparent;">
    <n-layout-sider content-style="padding: 24px;" style="background-color: transparent;">
      <n-card>
        <n-menu v-model:value="activeKey" mode="vertical" :options="menuOptions"
                @update-value="handleMenuSelect"/>
      </n-card>
    </n-layout-sider>
    <n-layout-content content-style="padding: 24px" style="background-color: transparent;">
      <router-view></router-view>
    </n-layout-content>
  </n-layout>
</template>

<script>
import { defineComponent, h, ref } from 'vue';
import { useRouter } from 'vue-router';
import { NIcon } from 'naive-ui';
import AdminPanelSettingsOutlined from '@vicons/material/AdminPanelSettingsOutlined';
import UserProfile from '@vicons/carbon/UserProfile';
// import Send from '@vicons/carbon/Send';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: 'User',
  setup() {
    const router = useRouter();
    const menuOptions = [
      {
        label: '用户管理',
        key: 'users',
        icon: renderIcon(UserProfile),
      },
      {
        label: '权限组管理',
        key: 'permission',
        icon: renderIcon(AdminPanelSettingsOutlined),
      },
    ];
    const activeKey = ref('users');
    const handleMenuSelect = (value) => {
      activeKey.value = value;
      router.push(value);
    };
    return {
      menuOptions,
      activeKey,
      handleMenuSelect,
    };
  },
});
</script>

<style scoped>

</style>
