<template>
  <n-card>
    <n-data-table
        min-height="400px"
        remote
        ref="table"
        :columns="columns"
        :data="UsersRows"
        :loading="TableLoading"
        :pagination="PaginationReactive"
        :row-key="rowKey"
        @update:page="UpdateUsersList"
    />
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, reactive, ref, h,
} from 'vue';
import {
  NButton, NTag, NIcon, useMessage, useDialog,
} from 'naive-ui';
import EditNoteRound from '@vicons/material/EditNoteRound';
import Delete from '@vicons/carbon/Delete';
import { GetAuthTypeName, GetAuthTypeString } from '@/components/userStateHelper';

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: 'Users',
  setup() {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();
    const dialog = useDialog();

    // user list 数据
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
      pageSize: 10,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      prefix({ itemCount }) {
        return `总用户数 ${itemCount}.`;
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        PaginationReactive.itemCount = res.data.total_number;
      }
      TableLoading.value = false;
    };

    // 删除用户相关
    const DeleteUser = async (uid: number) => {
      const { data: res } = await axios.post('/user/delete', {
        uid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      }
    };

    // 渲染相关
    const rowKey = (rowData: UsersListItemType) => rowData.uid;
    const columns = [
      {
        title: '用户名',
        key: 'username',
      },
      {
        title: '姓名',
        key: 'name',
      },
      {
        title: 'SEU ID',
        key: 'seu_id',
      },
      {
        title: '权限',
        key: 'authority',
        render(row: UsersListItemType) {
          return h(
            NTag,
            {
              style: {
                marginRight: '6px',
              },
              type: GetAuthTypeString(row.authority) as 'info',
              // type: typeinfo,
            },
            {
              default: () => GetAuthTypeName(row.authority),
            },
          );
        },
      },
      {
        title: '权限组',
        key: 'permission_group',
        render(row: UsersListItemType) {
          if (!row.permission_group) {
            return '— —';
          }
          // eslint-disable-next-line
          // @ts-ignore
          const tags = [];
          row.permission_group.forEach((value) => {
            tags.push(h(
              NTag,
              {
                style: {
                  marginRight: '2px',
                },
                type: 'info',
              }, {
                default: () => value.group_name,
              },
            ));
          });
          // eslint-disable-next-line
          // @ts-ignore
          return tags;
        },
      },
      {
        title: '操作',
        key: 'operation',
        render(row: UsersListItemType) {
          const userEditBtn = h(
            NButton,
            {
              style: {
                marginRight: '6px',
              },
              size: 'small',
              type: 'warning',
              // onClick: () => {
              //   showDetail(row.mid);
              // },
            },
            {
              default: () => '编辑',
              icon: renderIcon(EditNoteRound),
            },
          );
          const userDelBtn = h(
            NButton,
            {
              size: 'small',
              type: 'error',
              onClick: () => {
                const d = dialog.warning({
                  title: '删除用户确认',
                  content: `确认删除用户 ${row.username} ${row.name} 吗？`,
                  positiveText: '确定',
                  onPositiveClick: () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    d.loading = true;
                    return new Promise((resolve) => DeleteUser(row.uid).then(resolve));
                  },
                });
              },
            },
            {
              default: () => '删除',
              icon: renderIcon(Delete),
            },
          );
          // const userDel = h(
          //   NPopconfirm,
          //   {
          //     ref: DeleteUserPopRef,
          //   },
          //   {
          //     trigger: () => h(
          //       NButton,
          //       {
          //         size: 'small',
          //         type: 'error',
          //       },
          //       {
          //         default: () => '删除',
          //         icon: renderIcon(Delete),
          //       },
          //     ),
          //     default: () => '确认删除该用户吗',
          //     action: () => h(
          //       NButton,
          //       {
          //         size: 'small',
          //         type: 'error',
          //         onClick: async () => {
          //           await DeleteUser(111);
          //           await UpdateUsersList();
          //           console.log(DeleteUserPopRef);
          //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //           // @ts-ignore
          //           console.log(DeleteUserPopRef.value);
          //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //           // @ts-ignore
          //           console.log(DeleteUserPopRef.value.popoverInstRef);
          //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //           // @ts-ignore
          //           DeleteUserPopRef.value.popoverInstRef.value.setShow(false);
          //           // console.log(DeleteUserPopRef.value.setShow);
          //           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //           // @ts-ignore
          //           DeleteUserPopRef.value.setShow(false);
          //         },
          //         loading: DeleteUserLoading.value,
          //         disabled: DeleteUserLoading.value,
          //       },
          //       {
          //         default: () => '确定',
          //       },
          //     ),
          //   },
          // );
          return [userEditBtn, userDelBtn];
        },
      },
    ];

    onMounted(UpdateUsersList);

    return {
      TableLoading,
      columns,
      UsersRows,
      rowKey,
      PaginationReactive,

      UpdateUsersList,
    };
  },
});
</script>

<style scoped>

</style>
