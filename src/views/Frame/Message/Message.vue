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
import MailInboxAll24Regular from '@vicons/fluent/MailInboxAll24Regular';
import ChannelAdd20Regular from '@vicons/fluent/ChannelAdd20Regular';
import Send from '@vicons/carbon/Send';

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: 'Message',
  setup() {
    const router = useRouter();
    const menuOptions = [
      {
        label: '写站内信',
        key: 'write',
        icon: renderIcon(ChannelAdd20Regular),
      },
      {
        label: '收件箱',
        key: 'inbox',
        icon: renderIcon(MailInboxAll24Regular),
      },
      {
        label: '已发送',
        key: 'sent',
        icon: renderIcon(Send),
      },
    ];
    const activeKey = ref('inbox');
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
