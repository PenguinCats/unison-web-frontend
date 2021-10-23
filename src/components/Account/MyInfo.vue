<template>
  <n-card title="我的信息" class="myInfoCard">
    <div v-if="profileLoading">
      <n-space vertical>
        <n-skeleton height="40px" width="33%" />
        <n-skeleton height="40px" width="33%" />
        <n-skeleton height="40px" width="66%" :sharp="false" />
        <n-skeleton height="40px" width="66%" :sharp="false" />
        <n-skeleton height="40px" round />
        <n-skeleton height="40px" round />
      </n-space>
    </div>
    <div v-else>
      <n-form :model="profileForm" ref="FormRef" size="medium"
              label-placement="left" :label-width="100"
              :style="{
              maxWidth: '450px',
              marginLeft: '10%',
              marginRight: '10%',
            }"
      >
        <n-form-item label="用户名">
          <n-tag type="info" round size="large">{{ profileForm.username }}</n-tag>
        </n-form-item>
        <n-form-item path="name" label="姓名">
          <n-tag type="info" round size="large">{{ profileForm.name }}</n-tag>
        </n-form-item>
        <n-form-item path="authority" label="权限">
          <n-tag :type="authorityIconType" round size="large"> {{ authorityName }} </n-tag>
        </n-form-item>
        <n-form-item path="seu_id" label="SEU ID">
          <n-tag type="info" round size="large">{{ profileForm.seu_id }}</n-tag>
        </n-form-item>
        <n-form-item path="permission_groups" label="权限组">
          <n-tag type="info" size="large" class="tag_permission_tag"
                 v-for="item in permission_groups" v-bind:key="item.gid">{{item.gname}}</n-tag>
        </n-form-item>
      </n-form>
      <n-button type="primary" @click="userEditPwdHandler">修改密码</n-button>
    </div>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, h, inject, onMounted, ref,
} from 'vue';
import { useStore } from 'vuex';
import { useDialog, useMessage } from 'naive-ui';
import UserEditPwd from '@/views/Frame/User/UserEditPwd.vue';

interface permissionGroupType {
  gid: number,
  gname: string
}

export default defineComponent({
  name: 'MyInfo',
  setup() {
    const dialog = useDialog();
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const store = useStore();
    const { uid } = store.state;

    const profileLoading = ref(true);
    const profileForm = ref({
      username: '',
      name: '',
      seu_id: '',
      authority: 3,
    });
    // eslint-disable-next-line camelcase
    const permission_groups = ref(new Array<permissionGroupType>());

    onMounted(async () => {
      const { data: resProfile } = await axios.post('/user/profile', {
        uid,
      });
      if (resProfile.code !== 200) {
        message.warning(resProfile.msg);
      }
      profileForm.value.username = resProfile.data.username;
      profileForm.value.name = resProfile.data.name;
      profileForm.value.seu_id = resProfile.data.seu_id;
      profileForm.value.authority = resProfile.data.authority;

      const { data: resPermission } = await axios.post('/permission/user', {
        uid,
      });
      if (resPermission.code !== 200) {
        message.warning(resPermission.msg);
      }
      console.log(resPermission);
      const permissionGroups = [];
      // eslint-disable-next-line guard-for-in
      for (let k = 0; k < resPermission.data.gids.length; k += 1) {
        permissionGroups.push({
          gid: resPermission.data.gids[k],
          gname: resPermission.data.gnames[k],
        });
      }
      permission_groups.value = permissionGroups;

      profileLoading.value = false;
    });

    // user edit password
    const userEditPwdComponent = UserEditPwd;
    const userEditPwdDialog = dialog;
    const userEditPwdHandler = async () => {
      userEditPwdDialog.warning({
        bordered: true,
        title: '编辑用户',
        content: () => h(
          userEditPwdComponent, {
            uid,
            onDialogUserEditPwdDone: () => {
              userEditPwdDialog.destroyAll();
            },
          },
        ),
      });
    };

    const { authorityIconType, authorityName } = store.getters;
    return {
      profileLoading,
      profileForm,
      permission_groups,

      authorityIconType,
      authorityName,

      userEditPwdHandler,
    };
  },
});
</script>

<style scoped>
.myInfoCard {
  width: 30%;
  margin: auto;
}
.tag_permission_tag {
  margin-right: 12px;
}
</style>
