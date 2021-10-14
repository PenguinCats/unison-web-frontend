<template>
  <n-card>
    <n-skeleton v-if="TableLoading" height="500px" :sharp="false"></n-skeleton>
    <n-data-table v-else
      min-height="400px"
      remote
      ref="table"
      :columns="columns"
      :data="MessageRows"
      :loading="TableLoading"
      :pagination="PaginationReactive"
      :row-key="rowKey"
      @update:page="UpdateMessageList"
    />
    <n-modal v-model:show="DetailShow" >
      <n-card style="width: 80%;" title="站内信查看" :bordered="false" size="huge">
        <n-skeleton v-if="DetailLoading" height="450px" :sharp="false"></n-skeleton>
        <n-space vertical v-else>
          <div>标题： {{ DetailData.title }}</div>
          <div>
            <n-space>
              发自：
              <n-tag type="info" round>
                {{ DetailData.from_user_name_seu_id }}
              </n-tag>
              <n-tag :type="DetailData.from_user_authority_type_string" round>
                {{ DetailData.from_user_authority_type_name }}
              </n-tag>
            </n-space>
          </div>
          <div>时间： {{ DetailData.time }}</div>
          <n-divider></n-divider>
          <v-md-editor v-model="DetailData.text" height="400px" mode="preview"></v-md-editor>
        </n-space>
      </n-card>
    </n-modal>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, reactive, ref, h,
} from 'vue';
import {
  NButton, NTag, NIcon, useMessage,
} from 'naive-ui';
import CubeView from '@vicons/carbon/CubeView';
import Delete from '@vicons/carbon/Delete';
import { GetAuthTypeString, GetAuthTypeName, GetNameWithSEUID } from '@/components/userStateHelper';

// function getAuthTypeString(auth: number) :string {
//   switch (auth) {
//     case 1: return 'error';
//     case 2: return 'warning';
//     default: return 'info';
//   }
// }
// function getAuthTypeName(auth: number) : string {
//   switch (auth) {
//     case 1: return '超级管理员';
//     case 2: return '管理员';
//     default: return '普通用户';
//   }
// }
// function getNameWithSEUID(name: string, seuID:string) {
//   if (seuID === '') {
//     return name;
//   }
//   return `${seuID}, ${name}`;
// }

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: 'Inbox',
  setup() {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();

    // 表格数据及渲染
    interface MessageProfileType {
      id: number,
      mid: number,
      title: string,
      time: string,
      state: number,
      // eslint-disable-next-line camelcase
      from_user_name: string,
      // eslint-disable-next-line camelcase
      from_user_authority: number,
      // eslint-disable-next-line camelcase
      from_user_seu_id: string,
    }
    const MessageRows = ref(new Array<MessageProfileType>());

    // 分页数据获取
    const PaginationReactive = reactive({
      page: 1,
      pageSize: 10,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prefix({ itemCount }) {
        return `总消息数 ${itemCount}.`;
      },
    });
    const TableLoading = ref(true);
    const UpdateMessageList = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/message/message_inbox_profile_list', {
        page_size: PaginationReactive.pageSize,
        page_number: PaginationReactive.page,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        MessageRows.value = res.data.message_profile_list;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        PaginationReactive.itemCount = res.data.total_number;
      }
      TableLoading.value = false;
    };

    // 删除消息
    const DeleteLoading = ref(false);
    const delMessage = async (mid: number) => {
      DeleteLoading.value = true;
      const { data: res } = await axios.post('/message/delete', {
        mid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        message.success('删除成功');
        await UpdateMessageList();
      }
      DeleteLoading.value = false;
    };

    const DetailLoading = ref(false);
    const DetailShow = ref(false);
    const DetailData = ref({
      mid: 0,
      title: 'title',
      text: 'text',
      time: '2006-01-02 15:04:05',
      from_user_name_seu_id: 'loading',
      from_user_authority_type_string: 'info',
      from_user_authority_type_name: '普通用户',
    });
    // 详细信息表格及渲染
    const showDetail = async (mid: number) => {
      DetailShow.value = true;
      DetailLoading.value = true;
      const { data: res } = await axios.post('/message/message_inbox_detail', {
        mid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        DetailData.value.mid = res.data.mid;
        DetailData.value.title = res.data.title;
        DetailData.value.text = res.data.text;
        DetailData.value.time = res.data.time;
        // eslint-disable-next-line max-len
        DetailData.value.from_user_authority_type_string = GetAuthTypeString(res.data.from_user_authority);
        // eslint-disable-next-line max-len
        DetailData.value.from_user_authority_type_name = GetAuthTypeName(res.data.from_user_authority);
        DetailData.value.from_user_name_seu_id = GetNameWithSEUID(res.data.from_user_name,
          res.data.from_user_seu_id);

        await axios.post('/message/mark_read', {
          mid,
        });
        await UpdateMessageList();
      }
      DetailLoading.value = false;
    };

    // 数据渲染
    const rowKey = (rowData: MessageProfileType) => rowData.id;
    const columns = [
      {
        title: '状态',
        key: 'state',
        render(row: MessageProfileType) {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px',
              },
              type: row.state === 1 ? 'warning' : 'success',
            },
            {
              default: () => (row.state === 1 ? '未读' : '已读'),
            },
          );
        },
      },
      {
        title: '标题',
        key: 'title',
      },
      {
        title: '发件人',
        key: 'from',
        // eslint-disable-next-line
        render(row: MessageProfileType) {
          const userInfoTag = h(
            NTag,
            {
              style: {
                marginRight: '6px',
              },
              type: 'info',
            },
            {
              default: () => GetNameWithSEUID(row.from_user_name, row.from_user_seu_id),
            },
          );
          const userAuthTag = h(
            NTag,
            {
              style: {
                marginRight: '6px',
              },
              type: GetAuthTypeString(row.from_user_authority) as 'info',
              // type: typeinfo,
            },
            {
              default: () => GetAuthTypeName(row.from_user_authority),
            },
          );
          return [userInfoTag, userAuthTag];
        },
      },
      {
        title: '发件时间',
        key: 'time',
      },
      {
        title: '操作',
        key: 'operation',
        render(row: MessageProfileType) {
          const userInfoTag = h(
            NButton,
            {
              style: {
                marginRight: '6px',
              },
              size: 'small',
              type: 'info',
              onClick: () => {
                showDetail(row.mid);
              },
            },
            {
              default: () => '详情',
              icon: renderIcon(CubeView),
            },
          );
          const userDelTag = h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => {
                delMessage(row.mid);
              },
              loading: DeleteLoading.value,
            },
            {
              default: () => '删除',
              icon: renderIcon(Delete),
            },
          );
          return [userInfoTag, userDelTag];
        },
      },
    ];

    onMounted(UpdateMessageList);

    return {
      TableLoading,
      columns,
      MessageRows,
      rowKey,
      PaginationReactive,

      UpdateMessageList,

      DetailData,
      DetailLoading,
      DetailShow,
    };
  },
});
</script>

<style scoped>

</style>
