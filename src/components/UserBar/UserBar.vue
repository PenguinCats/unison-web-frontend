<template>
  <n-skeleton v-if="profileLoading" :width="150" :sharp="false" size="medium" />
  <div v-else>
    <n-space justify="end">
      <n-tag :type="authorityIconType" round size="large"> {{ authorityName }} </n-tag>
      <n-dropdown :options="options" @select="handleDropdownSelect" >
        <n-button color="#8a2be2" v-if="profileForm.seu_id !== ''" round>
          {{ profileForm.name}}, {{ profileForm.seu_id }}
        </n-button>
        <n-button color="#8a2be2" v-else round> {{ profileForm.name }} </n-button>
      </n-dropdown>
    </n-space>
  </div>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { NIcon } from 'naive-ui';
import {
  defineComponent, onMounted, ref, inject, h,
} from 'vue';
// eslint-disable-next-line import/no-extraneous-dependencies
import PersonCircleOutline from '@vicons/ionicons5/PersonCircleOutline';
// eslint-disable-next-line import/no-extraneous-dependencies
import LogOutOutline from '@vicons/ionicons5/LogOutOutline';

const renderIcon = (icon: any) => () => h(NIcon, null, {
  default: () => h(icon),
});

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const { uid } = store.state;
    const profileLoading = ref(true);
    const profileForm = ref({
      name: '',
      seu_id: '',
    });
    onMounted(async () => {
      const { data: res } = await axios.post('/user/profile', {
        uid,
      });
      profileForm.value.name = res.data.name;
      profileForm.value.seu_id = res.data.seu_id;
      profileLoading.value = false;
    });
    const { authorityIconType, authorityName } = store.getters;

    // eslint-disable-next-line no-unused-expressions
    const options = [
      {
        label: '用户信息',
        key: 'profile',
        icon: renderIcon(PersonCircleOutline),
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: renderIcon(LogOutOutline),
      },
    ];
    const handleDropdownSelect = (key: string) => {
      if (key === 'logout') {
        store.commit('clearUserInfo');
        sessionStorage.clear();
        router.push('/login');
      } else if (key === 'profile') {
        console.log('TODO');
      }
    };

    return {
      profileLoading,
      profileForm,
      authorityIconType,
      authorityName,
      options,
      handleDropdownSelect,
    };
  },
});
</script>

<style scoped>

</style>
