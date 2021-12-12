<template>
  <n-thing>
    <n-form :model="updateForm" ref="FormRef" :disabled="FormLoading" size="medium"
            label-placement="left" :label-width="100" :rules="rules"
            :style="{
              maxWidth: '650px'
            }"
    >
      <n-form-item path="name" label="权限组 名称">
        <n-input placeholder="名称" v-model:value="updateForm.name" type="text" round></n-input>
      </n-form-item>
    </n-form>
    <n-divider></n-divider>
    <div style="text-align: center">
      <n-button type="primary" @click="PermissionGroupAddHandler"
                :disabled="FormLoading" :loading="FormLoading">新增</n-button>
    </div>
  </n-thing>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { NForm, useMessage } from 'naive-ui';

const rules = {
  name: {
    required: true,
    message: '请输入权限组名称',
    trigger: 'blur',
  },
};

export default defineComponent({
  name: 'PermissionUpdateName',
  emits: ['dialog-permission-group-add-done'],
  setup(props, context) {
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    // eslint-disable-next-line vue/no-setup-props-destructure
    const updateForm = ref({
      name: '',
    });

    const FormRef = ref(null);
    const FormLoading = ref(false);

    const PermissionGroupAddHandler = () => {
      (FormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('表格填写不完整');
          return;
        }

        FormLoading.value = true;
        const { data: res } = await axios.post('/permission/add', {
          name: updateForm.value.name,
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
            '编辑权限组名称成功',
            {
              duration: 2000,
            },
          );
          context.emit('dialog-permission-group-add-done');
        }
      });
    };

    return {
      updateForm,
      FormRef,
      FormLoading,
      rules,
      PermissionGroupAddHandler,
    };
  },
});
</script>

<style scoped>

</style>
