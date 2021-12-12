<template>
  <n-card>
    <n-space vertical>
      <n-grid :cols="4">
        <n-grid-item span="1" style="text-align: left">
          <n-button @click="UpdateHostToken" :loading="HostAddTokenLoading"
                    type="primary" :disabled="HostAddTokenLoading">刷新新增主机密钥</n-button>
        </n-grid-item>
        <n-grid-item span="2" style="text-align: left">
          <n-tag type="error">密钥: {{HostAddToken}}</n-tag>
        </n-grid-item>
        <n-grid-item span="1" style="text-align: right">
          <n-tag>已识别的主机可展开查看详情</n-tag>
        </n-grid-item>
      </n-grid>
      <n-data-table
        min-height="400px"
        remote
        ref="table"
        :columns="columns"
        :data="HostRows"
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
  NButton,
  NGrid, NGridItem, NIcon, NTag, NThing, useDialog, useMessage,
} from 'naive-ui';
import EditCircle from '@vicons/tabler/EditCircle';
import Delete from '@vicons/carbon/Delete';
import HostUpdateExt from './HostUpdateExt.vue';

// eslint-disable-next-line
function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

interface hostItemType {
  hid: number
  // eslint-disable-next-line camelcase
  host_uuid: string
  ext: string

  // eslint-disable-next-line camelcase
  is_lost: boolean

  platform: string
  // eslint-disable-next-line camelcase
  platform_family: string
  // eslint-disable-next-line camelcase
  platform_version: string
  // eslint-disable-next-line camelcase
  memory_total_size: number
  // eslint-disable-next-line camelcase
  cpu_model_name: string
  // eslint-disable-next-line camelcase
  logical_core_cnt: number
  // eslint-disable-next-line camelcase
  physical_core_cnt:number
}

export default defineComponent({
  name: 'Host',
  setup() {
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();
    const dialog = useDialog();

    const HostRows = ref(new Array<hostItemType>());
    const TableLoading = ref(true);
    const getHostsList = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/host/all_list');
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        HostRows.value = res.data.hosts;
      }
      TableLoading.value = false;
    };
    onMounted(getHostsList);

    const HostAddToken = ref('待获取');
    const HostAddTokenLoading = ref(true);
    const getHostToken = async () => {
      HostAddTokenLoading.value = true;
      const { data: res } = await axios.post('/host/get_add_token');
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        HostAddToken.value = res.data.token;
      }
      HostAddTokenLoading.value = false;
    };
    onMounted(getHostToken);
    const UpdateHostToken = async () => {
      HostAddTokenLoading.value = true;
      const { data: res } = await axios.post('/host/update_add_token');
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        HostAddToken.value = res.data.token;
      }
      HostAddTokenLoading.value = false;
    };

    const deleteHost = async (hid: number) => {
      message.error('功能暂未实现');
      // const { data: res } = await axios.post('/permission/delete', {
      //   gid,
      // });
      // if (res.code !== 200) {
      //   message.error(res.msg);
      // }
    };

    const hostUpdateExtComponent = HostUpdateExt;
    const hostUpdateExtDialog = dialog;
    const HostExtInfoHandler = async (hid: number, uuid: string, hext: string) => {
      hostUpdateExtDialog.warning({
        bordered: true,
        title: '修改主机备注信息',
        content: () => h(
          hostUpdateExtComponent, {
            hid,
            uuid,
            hext,
            onDialogHostUpdateDone: () => {
              hostUpdateExtDialog.destroyAll();
              getHostsList();
            },
          },
        ),
      });
    };

    // 渲染相关
    const rowKey = (rowData: hostItemType) => rowData.hid;
    const columns = [
      {
        type: 'expand',
        expandable: (rowData: hostItemType) => !rowData.is_lost,
        renderExpand: (rowData: hostItemType) => {
          const expandItemList = [];

          expandItemList.push(h(NThing,
            {
              style: {
                marginBottom: '10px',
              },
            }, {
              default: () => h(
                NGrid,
                {
                  cols: 4,
                },
                {
                  default: () => {
                    const itemList = [];
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 2,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'CPU 型号',
                          },
                        ), rowData.cpu_model_name],
                      },
                    ));
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'CPU 物理核心数',
                          },
                        ), rowData.physical_core_cnt],
                      },
                    ));
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'CPU 虚拟核心数',
                          },
                        ), rowData.logical_core_cnt],
                      },
                    ));
                    return itemList;
                  },
                },
              ),
            }));

          expandItemList.push(h(NThing,
            {}, {
              default: () => h(
                NGrid,
                {
                  cols: 4,
                },
                {
                  default: () => {
                    const itemList = [];
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'Platform Family',
                          },
                        ), rowData.platform_family],
                      },
                    ));
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'Platform',
                          },
                        ), rowData.platform],
                      },
                    ));
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => 'Platform Version',
                          },
                        ), rowData.platform_version],
                      },
                    ));
                    itemList.push(h(
                      NGridItem,
                      {
                        span: 1,
                      }, {
                        default: () => [h(
                          NTag,
                          {
                            size: 'small',
                            type: 'info',
                            style: {
                              marginRight: '10px',
                            },
                          }, {
                            default: () => '内存大小 (GB)',
                          },
                        ), (rowData.memory_total_size / 1073741824).toFixed(2)],
                      },
                    ));
                    return itemList;
                  },
                },
              ),
            }));

          return expandItemList;
        },
      },
      {
        title: '主机 ID',
        key: 'hid',
      },
      {
        title: '唯一标识符',
        key: 'host_uuid',
      },
      {
        title: '是否可识别',
        key: 'is_lost',
        render(row: hostItemType) {
          if (row.is_lost) {
            return h(
              NTag,
              {
                size: 'small',
                type: 'error',
              },
              {
                default: () => '不可识别',
              },
            );
          }

          return h(
            NTag,
            {
              size: 'small',
              type: 'success',
            },
            {
              default: () => '可识别',
            },
          );
        },
      },
      {
        title: '备注信息',
        key: 'ext',
        width: 400,
      },
      {
        title: '操作',
        key: 'operation',
        render(row: hostItemType) {
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
                HostExtInfoHandler(row.hid, row.host_uuid, row.ext);
              },
            },
            {
              default: () => '编辑备注信息',
              icon: renderIcon(EditCircle),
            },
          );
          renderList.push(permissionGroupNameEditBtn);

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
                  title: '删除主机确认',
                  content: `确认删除主机 ${row.hid} ${row.host_uuid} 吗？`,
                  positiveText: '确定',
                  onPositiveClick: () => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    d.loading = true;
                    // eslint-disable-next-line
                    return new Promise((resolve) => deleteHost(row.hid).then(getHostsList).then(resolve));
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
      HostRows,
      TableLoading,

      HostAddToken,
      HostAddTokenLoading,
      UpdateHostToken,

      rowKey,
      columns,
    };
  },
});
</script>

<style scoped>

</style>
