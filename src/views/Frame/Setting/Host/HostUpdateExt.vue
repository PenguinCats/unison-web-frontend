<template>
  <n-thing>
    <n-form :model="updateForm" ref="FormRef" :disabled="FormLoading" size="medium"
            label-placement="left" :label-width="100"
            :style="{
              maxWidth: '650px'
            }"
    >
      <n-form-item label="主机 ID">
        <n-tag type="info">{{ updateForm.hid }}</n-tag>
      </n-form-item>
      <n-form-item label="主机 UUID">
        <n-tag type="info">{{ updateForm.uuid }}</n-tag>
      </n-form-item>
      <n-form-item path="name" label="主机 备注信息">
        <n-input placeholder="备注信息" v-model:value="updateForm.hext" type="text" round></n-input>
      </n-form-item>
    </n-form>
    <n-divider></n-divider>
    <div style="text-align: center">
      <n-button type="primary" @click="UpdateHostNameHandler"
                :disabled="FormLoading" :loading="FormLoading">修改</n-button>
    </div>
  </n-thing>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from 'vue';
import { NForm, useMessage } from 'naive-ui';

export default defineComponent({
  name: 'HostUpdateExt',
  props: ['hid', 'uuid', 'hext'],
  emits: ['dialog-host-update-done'],
  setup(props, context) {
    const message = useMessage();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    // eslint-disable-next-line vue/no-setup-props-destructure
    const hextCopy = props.hext;
    const updateForm = ref({
      hid: props.hid,
      uuid: props.uuid,
      hext: hextCopy,
    });

    const FormRef = ref(null);
    const FormLoading = ref(false);

    const UpdateHostNameHandler = async () => {
      FormLoading.value = true;
      const { data: res } = await axios.post('/host/update_ext', {
        hid: updateForm.value.hid,
        ext: updateForm.value.hext,
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
          '编辑主机备注信息成功',
          {
            duration: 2000,
          },
        );
        context.emit('dialog-host-update-done');
      }
    };

    return {
      updateForm,
      FormRef,
      FormLoading,

      UpdateHostNameHandler,
    };
  },
});
</script>

<style scoped>

</style>
