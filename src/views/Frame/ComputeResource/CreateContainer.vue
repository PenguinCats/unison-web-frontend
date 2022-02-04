<template>
  <div v-if="isInitLoading"
    style="height: 500px; text-align: center">
    <n-spin size="large" style="margin-top: 200px"></n-spin>
  </div>
  <template v-else>
    <n-card class="infoCard">
      <n-page-header title="主机基本信息" subtitle="或许你需要确认一下有没有选错主机吧"></n-page-header>
      <n-thing style="text-align: left">
        <n-space vertical>
          <n-thing>
            <n-grid :cols="4">
              <n-grid-item :span="2">
                <n-tag size="small" type="info" class="infoTag">CPU 型号</n-tag>
                {{ Host.cpu_model_name }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">CPU 物理核心数</n-tag>
                {{ Host.physical_core_cnt }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">CPU 虚拟核心数</n-tag>
                {{ Host.logical_core_cnt }}
              </n-grid-item>
            </n-grid>
          </n-thing>
          <n-thing>
            <n-grid :cols="4">
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">Platform Family</n-tag>
                {{ Host.platform_family }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">Platform</n-tag>
                {{ Host.platform }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">Platform Version</n-tag>
                {{ Host.platform_version }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="info" class="infoTag">内存大小 (GB)</n-tag>
                {{ (Host.memory_total_size / 1073741824).toFixed(2) }}
              </n-grid-item>
            </n-grid>
          </n-thing>
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="主机状态 & 资源" subtitle="申请的资源需要克制一点吧"></n-page-header>
      <n-thing style="text-align: left">
        <n-space vertical>
          <n-alert type="warning" title="硬盘资源申请说明">
            若申请的计算实例硬盘需求超过当前主机可用硬盘空间，则无法创建该实例。<br>
            硬盘空间创建后会立即占用，若申请过大会影响其他同学使用。建议初始控制在 30G 以内，之后可以按需扩容，但不支持减少。<br>
          </n-alert>
          <n-alert type="warning" title="其他资源申请说明">
            若申请的其他资源超过当前主机空闲量，则可以正常创建计算实例，但在资源足够前，无法启动。
          </n-alert>
          <n-thing v-if="HostStatus.stats !== 'online'">
            <n-tag size="small" type="error" class="infoTag">
              状态
            </n-tag> {{ HostStatus.stats }}
          </n-thing>
          <n-thing v-else>
            <n-grid :cols="4">
              <n-grid-item>
                <n-tag size="small" type="success" class="infoTag">
                  状态
                </n-tag> {{ HostStatus.stats }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="success" class="infoTag">
                  当前可用虚拟核心数
                </n-tag> {{ HostStatus.core_available }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="success" class="infoTag">
                  当前可用内存量 (GB)
                </n-tag> {{ (HostStatus.mem_available / 1073741824).toFixed(2) }}
              </n-grid-item>
              <n-grid-item>
                <n-tag size="small" type="success" class="infoTag">
                  当前可用硬盘空间 (GB)
                </n-tag> {{ (HostStatus.storage_available / 1073741824).toFixed(2) }}
              </n-grid-item>
            </n-grid>
          </n-thing>
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="CPU 资源" subtitle="逻辑内核数，或许可以理解为并行线程数吧"></n-page-header>
      <n-thing style="width: 400px">
        <n-space vertical>
          <n-slider v-model:value="FormCPU" :step="1"
                    :min="1" :max="Host.logical_core_cnt" />
          <n-input-number size="small" v-model:value="FormCPU"
                          :min="1" :max="Host.logical_core_cnt" />
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="内存资源" subtitle="你的程序预估所需内存数，记得留一点余量给 OS 吧"></n-page-header>
      <n-thing style="width: 400px">
        <n-space vertical>
          <n-slider v-model:value="FormMem" :step="1048576"
                    :min="104857600" :max="Host.memory_total_size"
                    :format-tooltip="value => `${value} Byte`"/>
          <n-input-number size="small" v-model:value="FormMem"
                          :min="104857600" :max="Host.memory_total_size" >
            <template #suffix>Byte</template>
          </n-input-number>
          <n-tag> {{ (FormMem / 1048576).toFixed(2) }} MB </n-tag>
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="硬盘资源" subtitle="你的程序预估所需硬盘量，记得留一点余量给 OS 吧"></n-page-header>
      <n-thing style="width: 800px">
        <n-space vertical>
          <n-slider v-model:value="FormStorage" :step="1073741824"
                    :min="5368709120" :max="HostStatus.storage_available"
                    :format-tooltip="value => `${value} Byte`"/>
          <n-input-number size="small" v-model:value="FormStorage"
                          :min="5368709120" :max="HostStatus.storage_available" >
            <template #suffix>Byte</template>
          </n-input-number>
          <n-tag> {{ (FormStorage / 1073741824).toFixed(2) }} GB </n-tag>
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="开放端口"
                     subtitle="由于 docker 的缘故，创建之后不支持修改吧。此外，请勿删除 TCP 22 端口，
                     否则连不上是你活该吧。"></n-page-header>
      <n-thing>
        <n-space vertical>
          <n-thing>TCP 端口</n-thing>
          <n-dynamic-tags v-model:value="FormTCPTags" />
          <n-thing>UDP 端口</n-thing>
          <n-dynamic-tags v-model:value="FormUDPTags" />
        </n-space>
      </n-thing>
    </n-card>
    <n-card class="infoCard">
      <n-page-header title="镜像选择"
                     subtitle="我预先准备的镜像，如果缺少你要的库，可以自己装吧，或者告诉管理员维护镜像吧。"></n-page-header>
      <n-thing>
        <n-radio-group v-model:value="FormImageName" name="imageName">
          <n-space vertical>
            <n-radio v-for="img in HostImages" :key="img.name" :value="img.name">
              <n-button>
                <n-tag size="small" type="info" class="infoTag">镜像名</n-tag>
                <span style="width: 500px; display: inline-block">
                            {{ img.name }}
                          </span>
                <n-tag size="small" type="info" class="infoTag">镜像大小 (MB)</n-tag>
                <span style="width: 200px; display: inline-block">
                            {{ (img.size / 1048576).toFixed(2) }}
                          </span>
                <n-tag size="small" type="info" class="infoTag">镜像创建日期</n-tag>
                {{ img.created_time }}
              </n-button>
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-thing>
    </n-card>
    <n-button type="primary" size="large" @click="CreateContainer">确定创建</n-button>
  </template>
  <CreateContainerOperation v-if="OperationResultShown" style="width: 80%"
                            :cid="CID" :id="OperationID"></CreateContainerOperation>
</template>

<script lang="ts">
import {
  defineComponent, inject, onMounted, ref,
} from 'vue';
import { useRoute } from 'vue-router';
import { useMessage } from 'naive-ui';
import CreateContainerOperation from '@/views/Frame/ComputeResource/CreateContainerOperation.vue';

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
  name: 'CreateContainer',
  components: { CreateContainerOperation },
  setup() {
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios
    const message = useMessage();
    const route = useRoute();

    // initLoading
    const isInitLoading = ref(true);
    const Host = ref<hostItemType>();
    const HostStatus = ref<hostItemStatus>();
    const HostImages = ref<hostImageItem[]>();

    const { uuid } = route.params;

    const getHostProfile = async () => {
      const { data: res } = await axios.post('/host/profile', {
        uuid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data) {
        Host.value = res.data;
      }
    };

    const getHostStatus = async () => {
      const { data: res } = await axios.post('/host/status', {
        uuids: [uuid],
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.status) {
        [HostStatus.value] = res.data.status;
      }
    };

    const GetHostImage = async () => {
      const { data: res } = await axios.post('/host/image_list', {
        uuid,
      });
      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.images) {
        HostImages.value = res.data.images;
      }
    };

    const init = async () => {
      await getHostProfile().then(async () => {
        await getHostStatus();
      }).then(() => {
        GetHostImage().then(() => {
          isInitLoading.value = false;
        });
      });
    };
    onMounted(init);

    // resource request info
    const FormCPU = ref<number>(1);
    const FormMem = ref<number>(104857600);
    const FormStorage = ref<number>(5368709120);
    const FormTCPTags = ref<number[]>([22]);
    const FormUDPTags = ref<number[]>([]);
    const FormImageName = ref<string>('');

    const OperationResultShown = ref(false);
    const OperationID = ref(0);
    const CID = ref(0);

    const CreateContainer = async () => {
      if (FormImageName.value === '') {
        message.error('请选择所需镜像后再创建计算实例');
        return;
      }

      const { data: res } = await axios.post('/container/create', {
        slave_uuid: uuid,
        image_name: FormImageName.value,
        exposed_tcp_ports: FormTCPTags.value,
        exposed_udp_ports: FormUDPTags.value,
        core_cnt: FormCPU.value,
        mem_size: FormMem.value,
        storage_size: FormStorage.value,
      });

      if (res.code !== 200) {
        message.error(res.msg);
      } else if (res.data.operation_id) {
        OperationID.value = res.data.operation_id;
        CID.value = res.data.cid;
        OperationResultShown.value = true;
        // await router.push(`/create_result/${operationID}`);
      }
    };

    return {
      isInitLoading,
      Host,
      HostStatus,
      HostImages,

      FormCPU,
      FormMem,
      FormStorage,
      FormTCPTags,
      FormUDPTags,
      FormImageName,

      OperationResultShown,
      OperationID,
      CID,

      CreateContainer,
    };
  },
});
</script>

<style scoped>
.infoCard {
  margin-bottom: 10px;
  margin-top: 10px;
  margin-left: 5%;
  width: 90%;
  text-align: left;
}
.infoTag {
  margin-left: 10px;
  margin-right: 10px;
}
</style>
