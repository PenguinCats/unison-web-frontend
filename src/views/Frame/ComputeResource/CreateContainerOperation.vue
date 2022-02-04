<template>
  <n-modal
    :mask-closable="false"
    :close-on-esc="false"
    preset="card"
    :closable="operationDown"
    @close="returnToResourceList"
    :show="true"
    class="modalBox">
    <n-thing class="modalBox">
      <Status @operation_end="operationDown = true" :id="operationID"></Status>
      <template v-if="operationDown">
        <n-divider></n-divider>
        <n-button type="primary" @click="goToContainerDetail">前往容器管理页</n-button>
      </template>
    </n-thing>
  </n-modal>
</template>

<script lang="ts">
import {
  defineComponent, ref, unref,
} from 'vue';

import { useRouter } from 'vue-router';
import Status from '@/components/Operation/Status.vue';

export default defineComponent({
  name: 'CreateContainerOperation',
  props: ['cid', 'id'],
  components: { Status },

  setup(props) {
    const router = useRouter();
    const cid: number = unref(props.cid);
    const operationID: number = unref(props.id);

    const operationDown = ref(false);

    const returnToResourceList = () => {
      router.push('/resource');
    };
    const goToContainerDetail = () => {
      router.push(`/resource/instance/${cid}`);
    };

    return {
      operationDown,
      operationID,
      returnToResourceList,
      goToContainerDetail,
    };
  },
});
</script>

<style scoped lang="less">
.modalBox {
  text-align: center;
}
</style>
