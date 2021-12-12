<template>
  <n-thing>
    <n-divider></n-divider>
    <n-form :model="EditPwdForm" ref="FormRef" :disabled="FormLoading" size="medium"
            label-placement="left" :label-width="100" :rules="rules"
            :style="{
              maxWidth: '450px'
            }"
    >
      <n-form-item path="password" label="新密码">
        <n-input placeholder="新密码" v-model:value="EditPwdForm.password" round
                 type="password" show-password-on="click"></n-input>
      </n-form-item>
    </n-form>
    <n-divider></n-divider>
    <div style="text-align: center">
      <n-button type="primary" @click="EditUserPwdHandler"
                :disabled="FormLoading" :loading="FormLoading">修改密码</n-button>
    </div>
  </n-thing>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { NForm, useMessage } from 'naive-ui';
import { Md5 } from 'md5-typescript';

const rules = {
  password: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

export default defineComponent({
  name: 'UserEditPwd',
  props: {
    uid: Number,
  },
  emits: ['dialog-user-edit-pwd-done'],
  setup(props, context) {
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const FormRef = ref(null);
    const FormLoading = ref(false);

    const EditPwdForm = ref({
      password: '',
    });

    const EditUserPwdHandler = () => {
      (FormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('用户密码修改表格填写不合法');
        }

        const pwd = Md5.init(EditPwdForm.value.password);
        FormLoading.value = true;
        const { data: res } = await axios.post('/user/pwd_edit', {
          uid: props.uid,
          password: pwd,
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
            '修改密码成功',
            {
              duration: 2000,
            },
          );
          context.emit('dialog-user-edit-pwd-done');
        }
      });
    };
    return {
      FormRef,
      FormLoading,
      EditPwdForm,

      rules,

      EditUserPwdHandler,
    };
  },
});
</script>

<style scoped>

</style>
