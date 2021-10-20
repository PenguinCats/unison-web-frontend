<template>
  <n-thing>
    <n-divider></n-divider>
    <n-form :model="registerForm" ref="FormRef" :disabled="FormLoading" size="medium"
            label-placement="left" :label-width="100" :rules="rules"
            :style="{
              maxWidth: '450px'
            }"
    >
      <n-form-item path="username" label="用户名">
        <n-input placeholder="用户名" v-model:value="registerForm.username"
                 type="text" round></n-input>
      </n-form-item>
      <n-form-item path="name" label="姓名">
        <n-input placeholder="姓名" v-model:value="registerForm.name" type="text" round></n-input>
      </n-form-item>
      <n-form-item path="authority" label="权限">
        <n-select v-model:value="registerForm.authority" :options="authorityOptions"
        :render-label="renderAuthorityLabel"></n-select>
      </n-form-item>
      <n-form-item path="password" label="密码">
        <n-input placeholder="密码" v-model:value="registerForm.password" round
                 type="password" show-password-on="click"></n-input>
      </n-form-item>
      <n-form-item path="seu_id" label="SEU ID">
        <n-input placeholder="SEU ID" v-model:value="registerForm.seu_id"
                 type="text" round></n-input>
      </n-form-item>
      <n-form-item path="permission_groups" label="权限组">
        <n-select v-model:value="registerForm.permission_group_list"
                  multiple
                  placeholder="选择用户所属的权限组（可为空）"
                  :options="permissionGroupOptions"
                  :loading="permissionGroupsLoading"
                  clearable
                  :render-label="renderPermissionGroupsLabel"
                  remote></n-select>
      </n-form-item>
    </n-form>
    <n-divider></n-divider>
    <div style="text-align: center">
      <n-button type="primary" @click="userAddHandler"
      :disabled="FormLoading" :loading="FormLoading">新增用户</n-button>
    </div>
  </n-thing>
</template>

<script lang="ts">
import { useStore } from 'vuex';
import {
  defineComponent, h, inject, onMounted, ref,
} from 'vue';
import { NForm, NTag, useMessage } from 'naive-ui';
import { Md5 } from 'md5-typescript';
import { GetAuthTypeString } from '@/components/userStateHelper';

const rules = {
  username: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
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
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

interface permissionGroupType {
  name: string
  id: number
  value :number
}

export default defineComponent({
  name: 'UserAdd',
  emits: ['dialog-user-add-done', 'click'],
  setup(props, context) {
    const store = useStore();
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const FormRef = ref(null);
    const FormLoading = ref(false);

    const permissionGroupsLoading = ref(true);
    const permissionGroupOptions = ref(new Array<permissionGroupType>());

    const registerForm = ref({
      username: '',
      password: '',
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
      const { data: res } = await axios.post('/permission/list');
      if (res.code === 200) {
        permissionGroupOptions.value = res.data.groups;
      }
      permissionGroupsLoading.value = false;
    });

    const userAddHandler = () => {
      (FormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('新用户注册表格填写不合法');
          return;
        }
        const pwd = Md5.init(registerForm.value.password);
        FormLoading.value = true;
        const { data: res } = await axios.post('/user/register', {
          username: registerForm.value.username,
          password: pwd,
          name: registerForm.value.name,
          authority: registerForm.value.authority,
          seu_id: registerForm.value.seu_id,
          permission_group_list: registerForm.value.permission_group_list,
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
            '新增用户成功',
            {
              duration: 2000,
            },
          );
          context.emit('dialog-user-add-done');
        }
      });
    };

    return {
      FormRef,
      FormLoading,
      rules,
      permissionGroupOptions,
      permissionGroupsLoading,
      renderPermissionGroupsLabel,
      registerForm,
      authorityOptions,
      renderAuthorityLabel,
      userAddHandler,
    };
  },
});
</script>

<style scoped>

</style>
