<template>
  <n-card>
    <n-form :model="messageForm" label-placement="left" :label-width="100" :rules="rules"
            ref="FormRef" :disabled="FormSendLoading">
      <n-form-item label="收件人" path="toUids">
        <n-select
          v-model:value="messageForm.to"
          multiple
          :loading="optionsLoading"
          :options="optionsUser"
          :render-label="renderOptionLabel"
          clearable
          filterable
          @search="handleSearch"
          remote
        />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input placeholder="标题" v-model:value="messageForm.title"
                 type="text" round maxlength="30"></n-input>
      </n-form-item>
      <n-form-item path="text">
        <v-md-editor v-model="messageForm.text" height="400px"
                     left-toolbar="undo redo clear |
                      h bold italic strikethrough quote |
                      ul ol table hr | link image code"></v-md-editor>
      </n-form-item>
      <NButton :loading="FormSendLoading" type="primary" @click="submitMessage">提交</NButton>
    </n-form>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, ref, h, inject,
} from 'vue';
import { NForm, NTag, useMessage } from 'naive-ui';
import { useStore } from 'vuex';
import { GetAuthTypeString, GetAuthTypeName, GetNameWithSEUID } from '@/components/userStateHelper';

interface toUserType {
  // 在获取到数据后，应当手动将 value 的值设置为 uid
  value: number
  uid: number
  name: string
  authority: number
  // eslint-disable-next-line camelcase
  seu_id: string
}

export default defineComponent({
  name: 'Write',
  setup() {
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();
    const store = useStore();

    const FormSendLoading = ref(false);
    const FormRef = ref(null);

    const rules = {
      toUids: {
        validate: (rule: never, value: Array<number>) => value.length > 0,
        trigger: 'blur',
        message: '至少有一个收件人',
      },
      title: {
        required: true,
        trigger: 'blur',
        message: '标题不能为空',
      },
      text: {
        required: true,
        trigger: 'blur',
        message: '正文不能为空',
      },
    };

    const messageForm = ref({
      title: '',
      text: '',
      to: [],
    });

    const optionsUser = ref(new Array<toUserType>());
    const optionsLoading = ref(false);
    const handleSearch = async (query: string) => {
      if (!query.length) {
        optionsUser.value = [];
        return;
      }
      optionsLoading.value = true;
      const { data: res } = await axios.post('/user/search', {
        query,
      });
      if (res.code === 200) {
        optionsUser.value = res.data.users;
      }
      optionsLoading.value = false;
    };
    const renderOptionLabel = (option: toUserType) => {
      const userInfoTag = h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: 'info',
        },
        {
          default: () => GetNameWithSEUID(option.name, option.seu_id),
        },
      );
      const userAuthTag = h(
        NTag,
        {
          style: {
            marginRight: '6px',
          },
          type: GetAuthTypeString(option.authority) as 'info',
        },
        {
          default: () => GetAuthTypeName(option.authority),
        },
      );
      return [userInfoTag, userAuthTag];
    };

    const submitMessage = () => {
      console.log(messageForm);
      (FormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('请输入合法的站内信');
        } else {
          FormSendLoading.value = true;
          const { data: res } = await axios.post('/message/add', {
            to: messageForm.value.to,
            title: messageForm.value.title,
            text: messageForm.value.text,
            from: store.state.uid,
          });
          if (res.code !== 200) {
            message.error(res.msg);
          } else {
            message.success('发送成功');
          }
          FormSendLoading.value = false;
        }
      });
    };

    return {
      FormSendLoading,
      FormRef,
      rules,
      messageForm,
      optionsUser,
      optionsLoading,
      handleSearch,
      renderOptionLabel,
      submitMessage,
    };
  },
});
</script>

<style scoped>

</style>
