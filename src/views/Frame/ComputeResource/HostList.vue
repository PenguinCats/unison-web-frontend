<template>
  <n-card title="授权主机列表" style="min-height: 600px">
    <template #header-extra>
      <n-tag>若未找到所需主机，可能是因为该账户无权访问或系统异常，请联系管理员</n-tag>
    </template>
    <n-divider></n-divider>
    <n-skeleton text v-if="InitLoading" :repeat="15" />
    <template v-else>
      <n-empty size="huge" v-if="HostRows.length === 0"
               description="您未被授权任何注册主机" style="margin-top: 250px"></n-empty>
      <n-collapse v-else :default-expanded-names="HostUUIDs">
        <n-collapse-item v-for="(host, idx) in HostRows" :key="host.host_uuid"
                         :name="host.host_uuid"
                         :title="'主机唯一标识符 ' + host.host_uuid">
          <template #header-extra>{{ host.ext }}</template>
          <div style="text-align: left">
            <n-space vertical>
              <n-thing>
                <n-grid :cols="4">
                  <n-grid-item :span="2">
                    <n-tag size="small" type="info" class="infoTag">CPU 型号</n-tag>
                    {{ host.cpu_model_name }}
                  </n-grid-item>
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">CPU 物理核心数</n-tag>
                    {{ host.physical_core_cnt }}
                  </n-grid-item>
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">CPU 虚拟核心数</n-tag>
                    {{ host.logical_core_cnt }}
                  </n-grid-item>
                </n-grid>
              </n-thing>
              <n-thing>
                <n-grid :cols="4">
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">Platform Family</n-tag>
                    {{ host.platform_family }}
                  </n-grid-item>
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">Platform</n-tag>
                    {{ host.platform }}
                  </n-grid-item>
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">Platform Version</n-tag>
                    {{ host.platform_version }}
                  </n-grid-item>
                  <n-grid-item>
                    <n-tag size="small" type="info" class="infoTag">内存大小 (GB)</n-tag>
                    {{ (host.memory_total_size / 1073741824).toFixed(2) }}
                  </n-grid-item>
                </n-grid>
              </n-thing>
              <n-thing v-if="HostStatus[idx]">
                <n-thing v-if="HostStatus[idx].stats !== 'online'">
                  <n-tag size="small" type="error" class="infoTag">
                    状态
                  </n-tag> {{ HostStatus[idx].stats }}
                </n-thing>
                <n-thing v-else>
                  <n-grid :cols="4">
                    <n-grid-item>
                      <n-tag size="small" type="success" class="infoTag">
                        状态
                      </n-tag> {{ HostStatus[idx].stats }}
                    </n-grid-item>
                    <n-grid-item>
                      <n-tag size="small" type="success" class="infoTag">
                        当前可用虚拟核心数
                      </n-tag> {{ HostStatus[idx].core_available }}
                    </n-grid-item>
                    <n-grid-item>
                      <n-tag size="small" type="success" class="infoTag">
                        当前可用内存量 (GB)
                      </n-tag> {{ (HostStatus[idx].mem_available / 1073741824).toFixed(2) }}
                    </n-grid-item>
                    <n-grid-item>
                      <n-tag size="small" type="success" class="infoTag">
                        当前可用硬盘空间 (GB)
                      </n-tag> {{ (HostStatus[idx].storage_available / 1073741824).toFixed(2) }}
                    </n-grid-item>
                  </n-grid>
                </n-thing>
              </n-thing>
              <n-collapse v-if="HostStatus[idx] && HostStatus[idx].stats === 'online'"
                          @item-header-click="GetHostImage">
                <n-collapse-item title="镜像列表" :name="idx">
                  <template v-if="!host.image_fetched">
                    <n-spin size="large" />
                  </template>
                  <template v-else>
                    <n-thing v-if="host.images">
                      <n-space vertical>
                        <n-thing v-for="(img, img_idx) in host.images" :key="img_idx">
                          <n-tag size="small" type="info" class="infoTag">镜像名</n-tag>
                          {{ img.name }}
                          <n-tag size="small" type="info" class="infoTag">镜像大小 (MB)</n-tag>
                          {{ (img.size / 1048576).toFixed(2) }}
                          <n-tag size="small" type="info" class="infoTag">镜像创建日期</n-tag>
                          {{ img.created_time }}
                        </n-thing>
                      </n-space>
                    </n-thing>
                    <n-empty v-else description="无可用镜像"></n-empty>
                  </template>
                </n-collapse-item>
              </n-collapse>
            </n-space>
          </div>
        </n-collapse-item>
      </n-collapse>
    </template>
  </n-card>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref,
} from 'vue';
import { useMessage } from 'naive-ui';

interface hostImageItem {
  name: string
  size: number
  // eslint-disable-next-line camelcase
  created_time: string
}

interface hostItemType {
  hid: number
  // eslint-disable-next-line camelcase
  host_uuid: string
  ext: string

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

  // eslint-disable-next-line camelcase
  images: hostImageItem[]
  // eslint-disable-next-line camelcase
  image_fetched: boolean
}

interface hostItemStatus {
  // eslint-disable-next-line camelcase
  host_uuid: string

  stats: string
  // eslint-disable-next-line camelcase
  core_available: number
  // eslint-disable-next-line camelcase
  mem_available: number
  // eslint-disable-next-line camelcase
  storage_available: number
}

export default defineComponent({
  name: 'HostList',
  setup() {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();

    // initLoading
    const InitLoading = ref(true);
    const HostRows = ref(new Array<hostItemType>());
    const HostStatus = ref(new Array<hostItemStatus>());
    const HostUUIDs = ref(new Array<string>());

    const getHostsList = async () => {
      const { data: res } = await axios.post('/host/authorized_list');
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.hosts) {
        HostRows.value = res.data.hosts;
        HostUUIDs.value = HostRows.value.map((item) => item.host_uuid);

        // 添加待获取镜像列表的辅助数据结构
        HostRows.value.forEach((_, idx) => {
          HostRows.value[idx].image_fetched = false;
          HostRows.value[idx].images = [];
        });
      }
    };

    const getHostStatus = async () => {
      const { data: res } = await axios.post('/host/status', {
        uuids: HostUUIDs.value,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.status) {
        HostStatus.value = res.data.status;
      }
    };

    const init = async () => {
      await getHostsList().then(() => {
        getHostStatus();
      }).then(() => {
        InitLoading.value = false;
      });
    };
    onMounted(init);

    const GetHostImage = async ({ name }: {name: number}) => {
      if (HostRows.value[name].image_fetched) {
        return;
      }

      const { data: res } = await axios.post('/host/image_list', {
        uuid: HostRows.value[name].host_uuid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.images) {
        HostRows.value[name].images = res.data.images;
        HostRows.value[name].image_fetched = true;
      }
    };

    return {
      InitLoading,
      HostRows,
      HostStatus,
      HostUUIDs,
      GetHostImage,
    };
  },
});
</script>

<style scoped>
.infoTag {
  margin-right: 10px;
}
</style>
