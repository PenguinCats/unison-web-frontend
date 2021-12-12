<template>
  <n-card>
    <n-space vertical>
      <div style="text-align: left">
        <n-button @click="PermissionGroupAddHandler" type="primary">新增权限组</n-button>
      </div>
      <n-data-table
        min-height="400px"
        remote
        ref="table"
        :columns="columns"
        :data="PermissionGroupRows"
        :loading="TableLoading"
        :row-key="rowKey"
      />
    </n-space>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, h, inject, onMounted, ref,
} from 'vue';
import {
  NButton, NIcon, NTag, useDialog, useMessage,
} from 'naive-ui';
import EditCircle from '@vicons/tabler/EditCircle';
import Server20Regular from '@vicons/fluent/Server20Regular';
import Delete from '@vicons/carbon/Delete';
import { useRouter } from 'vue-router';
import PermissionGroupUpdateName from './PermissionGroupUpdateName.vue';
import PermissionGroupAdd from './PermissionGroupAdd.vue';

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export default defineComponent({
  name: 'Permission',
  setup() {
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();
    const dialog = useDialog();
    const router = useRouter();

    // permission group 数据
    interface permissionGroupInfoItem {
      id: number,
      value :number
      name: string,
      // eslint-disable-next-line camelcase
      host_cnt: number,
    }
    const PermissionGroupRows = ref(new Array<permissionGroupInfoItem>());

    const TableLoading = ref(true);
    const UpdateHostsList = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/permission/list');
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        PermissionGroupRows.value = res.data.groups;
      }
      TableLoading.value = false;
    };

    onMounted(UpdateHostsList);

    const deletePermissionGroup = async (gid: number) => {
      const { data: res } = await axios.post('/permission/delete', {
        gid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      }
    };

    // edit permission group name
    const permissionGroupNameEditComponent = PermissionGroupUpdateName;
    const permissionGroupNameEditDialog = dialog;
    const permissionGroupNameEditHandler = async (gid: number, gname: string) => {
      permissionGroupNameEditDialog.warning({
        bordered: true,
        title: '修改权限组名称',
        content: () => h(
          permissionGroupNameEditComponent, {
            gid,
            gname,
            onDialogPermissionGroupUpdateDone: () => {
              permissionGroupNameEditDialog.destroyAll();
              UpdateHostsList();
            },
          },
        ),
      });
    };

    // add permission group
    const permissionGroupAddComponent = PermissionGroupAdd;
    const permissionGroupAddDialog = dialog;
    const PermissionGroupAddHandler = async () => {
      permissionGroupAddDialog.warning({
        bordered: true,
        title: '新增权限组',
        content: () => h(
          permissionGroupAddComponent, {
            onDialogPermissionGroupAddDone: () => {
              permissionGroupAddDialog.destroyAll();
              UpdateHostsList();
            },
          },
        ),
      });
    };

    // edit permission group hosts
    const UpdatePermissionGroupHostsHandler = (gid: number) => {
      router.push({
        path: `permission_hosts/${gid}`,
      });
    };

    // 渲染相关
    const rowKey = (rowData: permissionGroupInfoItem) => rowData.id;
    const columns = [
      {
        title: '权限组 ID',
        key: 'id',
        width: 150,
      },
      {
        title: '权限组 名称',
        key: 'name',
        width: 450,
      },
      {
        title: '关联主机数',
        key: 'host_cnt',
      },
      {
        title: '操作',
        key: 'operation',
        render(row: permissionGroupInfoItem) {
          const renderList = [];
          const permissionGroupNameEditBtn = h(
            NButton,
            {
              style: {
                marginRight: '6px',
              },
              size: 'small',
              type: 'info',
              onClick: () => {
                permissionGroupNameEditHandler(row.id, row.name);
              },
            },
            {
              default: () => '编辑名称',
              icon: renderIcon(EditCircle),
            },
          );
          renderList.push(permissionGroupNameEditBtn);

          const permissionGroupHostEditPwdBtn = h(
            NButton,
            {
              style: {
                marginRight: '6px',
              },
              size: 'small',
              type: 'info',
              onClick: () => {
                UpdatePermissionGroupHostsHandler(row.id);
              },
            },
            {
              default: () => '编辑所关联的主机',
              icon: renderIcon(Server20Regular),
            },
          );
          renderList.push(permissionGroupHostEditPwdBtn);

          const permissionGroupDelBtn = h(
            NButton,
            {
              size: 'small',
              type: 'error',
              style: {
                marginRight: '6px',
              },
              onClick: () => {
                const d = dialog.warning({
                  title: '删除权限组确认',
                  content: `确认删除权限组 ${row.id} ${row.name} 吗？`,
                  positiveText: '确定',
                  onPositiveClick: () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    d.loading = true;
                    // eslint-disable-next-line
                    return new Promise((resolve) => deletePermissionGroup(row.id).then(UpdateHostsList).then(resolve));
                  },
                });
              },
            },
            {
              default: () => '删除',
              icon: renderIcon(Delete),
            },
          );
          renderList.push(permissionGroupDelBtn);
          return renderList;
        },
      },
    ];

    return {
      TableLoading,
      columns,
      PermissionGroupRows,
      rowKey,

      UpdateHostsList,
      PermissionGroupAddHandler,
    };
  },
});
</script>

<style scoped>

</style>
