<template>
  <n-card>
    <n-space vertical>
      <n-page-header @back="HandleBack">
        <template #title>
          选择权限组关联的主机
        </template>
        <template #subtitle>
          <n-tag>已识别的主机可展开查看详情</n-tag>
        </template>
      </n-page-header>

      <n-data-table
        min-height="400px"
        remote
        ref="table"
        :columns="columns"
        :data="HostRows"
        :checked-row-keys="CheckedRowKeys"
        @update-checked-row-keys="CheckedRowKeysChange"
        :loading="TableLoading"
        :row-key="rowKey"
      />

      <div style="text-align: left">
        <n-button @click="PermissionGroupHostBindHandler"
                  type="primary" :loading="TableLoading" :disabled="TableLoading">确认修改</n-button>
      </div>
    </n-space>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, h, inject, onMounted, ref,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  NButton, NGrid, NGridItem, NTag, NThing, useMessage,
} from 'naive-ui';

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
  name: 'PermissionGroupHostEdit',
  setup() {
    const route = useRoute();
    const router = useRouter();
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();

    const HandleBack = () => {
      router.push('/setting/permission');
    };

    const { gid } = route.params;

    const HostRows = ref(new Array<hostItemType>());
    const CheckedRowKeys = ref(new Array<number>());
    const CheckedRowKeysChange = (checkedList: number[]) => {
      CheckedRowKeys.value = checkedList;
    };

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
    const getExistingHosts = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/permission/host', {
        gid: Number(gid),
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else {
        CheckedRowKeys.value = res.data.hids;
      }
      TableLoading.value = false;
    };

    onMounted(getHostsList);
    onMounted(getExistingHosts);

    const PermissionGroupHostBindHandler = async () => {
      TableLoading.value = true;
      const { data: res } = await axios.post('/permission/host_bind', {
        gid: Number(gid),
        hids: CheckedRowKeys.value,
      });
      TableLoading.value = false;
      if (res.code !== 200) {
        message.error(
          res.msg,
          {
            duration: 2000,
          },
        );
      } else {
        message.success(
          '编辑权限组关联主机成功',
          {
            duration: 2000,
          },
        );
      }
    };

    // 渲染相关
    const rowKey = (rowData: hostItemType) => rowData.hid;
    const columns = [
      {
        type: 'selection',
        // disabled(row: hostItemType) {
        //   return row.is_lost;
        // },
      },
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
    ];

    return {
      gid,
      HandleBack,

      HostRows,
      CheckedRowKeys,
      CheckedRowKeysChange,
      TableLoading,

      rowKey,
      columns,
      PermissionGroupHostBindHandler,
    };
  },
});
</script>

<style scoped>

</style>
