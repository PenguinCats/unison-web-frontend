<template>
  <n-card>
    <n-form :model="messageForm" label-placement="left" :label-width="100">
      <n-form-item>
        <n-input placeholder="标题" v-model:value="messageForm.title" type="text" round></n-input>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'Write',
  setup() {
    const initLoading = ref(true);
    const messageForm = ref({
      title: '',
      text: '',
      to: [],
    });
    return {
      initLoading,
      messageForm,
    };
  },
});
</script>

<style scoped>

</style>
