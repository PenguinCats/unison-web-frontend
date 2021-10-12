<template>
  <n-card></n-card>
</template>

<script>
import {
  defineComponent, inject, onMounted, reactive, ref, h,
} from 'vue';
import {
  NButton, NTag, NIcon, useMessage,
} from 'naive-ui';

export default defineComponent({
  name: 'Users',
  setup() {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();

    interface PermissionGroup {
      // eslint-disable-next-line camelcase
      group_id: number,
      // eslint-disable-next-line camelcase
      group_name: string,
    }
    interface UsersListItemType {
      uid: number,
      username: string,
      name: string,
      authority: number,
      // eslint-disable-next-line camelcase
      seu_id: string,

      // eslint-disable-next-line camelcase
      permission_group: PermissionGroup[],
    }
    const UsersRows = ref(new Array<UsersListItemType>());

    // 分页数据获取
    const PaginationReactive = reactive({
      page: 1,
      pageCount: 1,
      pageSize: 10,
      itemCount: 0,
      prefix(itemCount: number) {
        return `总消息数 ${itemCount}.`;
      },
    });
    const TableLoading = ref(true);
    const UpdateUsersList = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/user/list', {
        page_size: PaginationReactive.pageSize,
        page_number: PaginationReactive.page,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        UsersRows.value = res.data.user_list;
        PaginationReactive.itemCount = res.data.total_number;
      }
      TableLoading.value = false;
    };
  },
});
</script>

<style scoped>

</style>
