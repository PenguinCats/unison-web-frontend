<template>
  <n-thing>
    <n-divider></n-divider>
    <div v-if="InitLoading">
      <n-space vertical>
        <n-skeleton height="40px" width="33%" />
        <n-skeleton height="40px" width="33%" />
        <n-skeleton height="40px" width="66%" :sharp="false" />
        <n-skeleton height="40px" width="66%" :sharp="false" />
        <n-skeleton height="40px" round />
        <n-skeleton height="40px" round />
      </n-space>
    </div>
    <n-form v-else
            :model="userForm" ref="FormRef" :disabled="FormLoading" size="medium"
            label-placement="left" :label-width="100" :rules="rules"
            :style="{
              maxWidth: '450px'
            }"
    >
      <n-form-item label="用户名">
        <n-tag type="info">{{ userForm.username }}</n-tag>
      </n-form-item>
      <n-form-item path="name" label="姓名">
        <n-input placeholder="姓名" v-model:value="userForm.name" type="text" round></n-input>
      </n-form-item>
      <n-form-item path="authority" label="权限">
        <n-select v-model:value="userForm.authority" :options="authorityOptions"
                  :render-label="renderAuthorityLabel"></n-select>
      </n-form-item>
      <n-form-item path="seu_id" label="SEU ID">
        <n-input placeholder="SEU ID" v-model:value="userForm.seu_id"
                 type="text" round></n-input>
      </n-form-item>
      <n-form-item path="permission_groups" label="权限组">
        <n-select v-model:value="userForm.permission_group_list"
                  multiple
                  placeholder="选择用户所属的权限组（可为空）"
                  :options="permissionGroupOptions"
                  clearable
                  :render-label="renderPermissionGroupsLabel"
                  remote></n-select>
      </n-form-item>
    </n-form>
    <n-divider></n-divider>
    <div style="text-align: center">
      <n-button type="primary" @click="userEditHandler"
      :disabled="FormLoading" :loading="FormLoading">修改用户</n-button>
    </div>
  </n-thing>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent, h, inject, onMounted, ref,
} from 'vue';
import { NForm, NTag, useMessage } from 'naive-ui';
import { GetAuthTypeString } from '@/components/userStateHelper';

const rules = {
  name: {
    required: true,
    message: '请输入姓名',
    trigger: 'blur',
  },
  authority: {
    required: true,
    validator: () => true,
    message: '请选择权限',
    trigger: 'blur',
  },
};

interface permissionGroupType {
  name: string
  id: number
  value :number
}

export default defineComponent({
  name: 'UserEdit',
  props: {
    uid: Number,
  },
  emits: ['dialog-user-edit-done'],
  setup(props, context) {
    const store = useStore();
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const InitLoading = ref(true);

    const FormRef = ref(null);
    const FormLoading = ref(false);

    const permissionGroupOptions = ref(new Array<permissionGroupType>());

    const userForm = ref({
      username: '',
      name: '',
      authority: 3,
      seu_id: '',
      permission_group_list: [],
    });

    const authorityOptions = [
      {
        label: '普通用户',
        value: 3,
      },
    ];
    if (store.state.authority === 1) {
      authorityOptions.push({
        label: '管理员',
        value: 2,
      });
    }
    const renderAuthorityLabel = (option: { value: number; label: string; }) => h(
      NTag,
      {
        style: {
          marginRight: '6px',
        },
        type: GetAuthTypeString(option.value) as 'info',
      },
      {
        default: () => option.label,
      },
    );

    const renderPermissionGroupsLabel = (option: permissionGroupType) => h(
      NTag,
      {
        style: {
          marginRight: '6px',
        },
        type: 'info',
      },
      {
        default: () => option.name,
      },
    );

    onMounted(async () => {
      const { data: resPermissionList } = await axios.post('/permission/list');
      if (resPermissionList.code === 200) {
        permissionGroupOptions.value = resPermissionList.data.groups;
      } else {
        message.error(resPermissionList.msg);
      }

      const { data: resUserProfile } = await axios.post('/user/profile', {
        uid: props.uid,
      });
      if (resUserProfile.code === 200) {
        userForm.value.username = resUserProfile.data.username;
        userForm.value.seu_id = resUserProfile.data.seu_id;
        userForm.value.name = resUserProfile.data.name;
        userForm.value.authority = resUserProfile.data.authority;
      } else {
        message.error(resUserProfile.msg);
      }

      const { data: resUserPermission } = await axios.post('/permission/user', {
        uid: props.uid,
      });
      if (resUserPermission.code === 200) {
        userForm.value.permission_group_list = resUserPermission.data.gids;
      } else {
        message.error(resUserPermission.msg);
      }

      InitLoading.value = false;
    });

    const userEditHandler = () => {
      (FormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('用户编辑表格填写不合法');
          return;
        }

        FormLoading.value = true;
        const { data: res } = await axios.post('/user/edit', {
          uid: props.uid,
          name: userForm.value.name,
          authority: userForm.value.authority,
          seu_id: userForm.value.seu_id,
          permission_group_list: userForm.value.permission_group_list,
        });
        FormLoading.value = false;
        if (res.code !== 200) {
          message.error(
            res.msg,
            {
              duration: 2000,
            },
          );
        } else {
          message.success(
            '编辑用户成功',
            {
              duration: 2000,
            },
          );
          context.emit('dialog-user-edit-done');
        }
      });
    };

    return {
      InitLoading,

      FormRef,
      FormLoading,
      userForm,

      rules,

      permissionGroupOptions,
      renderPermissionGroupsLabel,

      authorityOptions,
      renderAuthorityLabel,

      userEditHandler,
    };
  },
});
</script>

<style scoped>

</style>
