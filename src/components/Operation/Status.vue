<template>
  <n-card title="操作状态" class="operationStatusCard">
    <n-space vertical>
      <n-spin v-if="Ope.status === 0 || Ope.status === 1" size="large"></n-spin>
      <n-alert :title="StatusWord" :type="StatusTypeString"></n-alert>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref, unref,
} from 'vue';
import { useMessage } from 'naive-ui';
import { GetOperationStatusTypeString, GetOperationStatusDescription } from '@/components/operationStateHelper';

interface operation {
  // eslint-disable-next-line camelcase
  status: number
  result: string
}

export default defineComponent({
  name: 'Status',
  props: ['id'],
  emits: ['operation_end'],
  // components: {CreateContainerOperation},
  setup(props, context) {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();

    const Ope = ref<operation>({
      status: 0,
      result: '指令待发出',
    });

    const StatusWord = ref('指令待发出');
    const StatusTypeString = ref('info');

    const operationID: string = unref(props.id);
    const updateStatus = async () => {
      const { data: res } = await axios.post('/operation/status', {
        id: operationID,
      });
      if (res.code !== 200) {
        message.error(
          res.msg,
          {
            duration: 2000,
          },
        );
      } else {
        Ope.value = res.data;

        StatusWord.value = GetOperationStatusDescription(Ope.value.status);
        StatusTypeString.value = GetOperationStatusTypeString(Ope.value.status);

        if (Ope.value.status === 0 || Ope.value.status === 1) {
          setTimeout(updateStatus, 1000);
        } else {
          // if (Ope.value.status === 2) {
          //   StatusWord.value = '发送指令失败';
          //   StatusTypeString.value = 'error';
          // } else if (Ope.value.status === 3) {
          //   StatusWord.value = '指令执行成功';
          //   StatusTypeString.value = 'success';
          // } else if (Ope.value.status === 4) {
          //   StatusWord.value = '指令执行失败';
          //   StatusTypeString.value = 'error';
          // } else {
          //   StatusWord.value = '未知错误';
          //   StatusTypeString.value = 'error';
          // }
          context.emit('operation_end');
        }
      }
    };
    onMounted(updateStatus);

    return {
      Ope,
      StatusWord,
      StatusTypeString,
    };
  },
});
</script>

<style scoped>
.operationStatusCard{
  width: 800px;
  text-align: center;
  margin:0 auto;
}
</style>
