<template>
  <n-layout has-sider style="height: 100%">
    <n-layout-sider bordered>
      <n-menu v-model:value="activeKey" mode="vertical" :options="menuOptions"
      @update-value="handleMenuSelect"/>
    </n-layout-sider>
    <n-layout>
      <router-view></router-view>
    </n-layout>
  </n-layout>
</template>

<script>
import { h, ref } from 'vue';
import { useRouter } from 'vue-router';

// eslint-disable-next-line import/no-extraneous-dependencies
import Server from '@vicons/tabler/Server';
// eslint-disable-next-line import/no-extraneous-dependencies
import CloudServerOutlined from '@vicons/antd/CloudServerOutlined';
import { NIcon } from 'naive-ui';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default {
  name: 'ComputeResourceFramework',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const router = useRouter();
    const menuOptions = [
      {
        label: '主机列表',
        key: 'host',
        icon: renderIcon(Server),
      },
      {
        label: '计算实例',
        key: 'instance',
        icon: renderIcon(CloudServerOutlined),
      },
    ];
    const activeKey = ref('host');
    const handleMenuSelect = (value) => {
      activeKey.value = value;
      // eslint-disable-next-line no-restricted-globals
      console.log(value);
      router.push(value);
    };
    return {
      Server,
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
.n-layout-sider{
  background-color: #fff;
}
</style>
