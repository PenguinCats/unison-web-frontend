<template>
  <div class="background">
    <div class="logoDiv">
      <n-grid x-gap="30" :cols="4">
        <n-gi>
          <img :src="urcp_logo_img_url" class="logo" alt="URCP logo">
        </n-gi>
        <n-gi span="3">
          <div style="text-align: left">
            <i class="web-font">衡·资源共享云平台</i>
          </div>
          <div style="text-align: left">
            <i class="web-font">Unison Resource Cloud Platform</i>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <div class="loginCard">
      <div class="loginTitle">登录</div>
      <div class="loginFormBox">
        <n-form :model="loginForm" label-placement="left" :label-width="100" size="medium"
                :rules="rules" ref="loginFormRef" :disabled="loginLoading">
          <n-form-item path="uname">
            <n-input placeholder="用户名" v-model:value="loginForm.uname" type="text" round></n-input>
          </n-form-item>
          <n-form-item path="upwd">
            <n-input placeholder="密码" v-model:value="loginForm.upwd" type="password"
                     show-password-on="click" round></n-input>
          </n-form-item>
          <n-button type="primary" round style="width: 100%" @click="normalLogin"
                    :loading="loginLoading" :disabled="loginLoading">登 录</n-button>
        </n-form>
      </div>
      <n-divider></n-divider>
      <div class="otherLoginMethod">
          <n-grid x-gap="12" :cols="3">
            <n-gi>
              <div style="position: relative; top: 50%; transform: translateY(-50%);">其他方式登录</div>
            </n-gi>
            <n-gi>
              <n-button @click="seuLogin" :bordered="false">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <img :src="seu_login_img_url" class="otherLoginMethodLogo" alt="seu login">
                  </template>
                  东南大学统一身份认证登录
                </n-tooltip>
              </n-button>
            </n-gi>
            <n-gi>
              <n-button @click="qqLogin" :bordered="false">
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <img :src="qq_login_img_url" class="otherLoginMethodLogo" alt="qq login">
                  </template>
                  QQ登录
                </n-tooltip>
              </n-button>
            </n-gi>
          </n-grid>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent, ref, inject,
} from 'vue';
import { useStore } from 'vuex';
import { NForm, useMessage, useLoadingBar } from 'naive-ui';
import jsSHA from 'jssha';
import { Md5 } from 'md5-typescript';
import { useRouter } from 'vue-router';

const rules = {
  uname: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  upwd: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

function uuid() {
  const tempURL = URL.createObjectURL(new Blob());
  const id = tempURL.toString(); // blob:https://xxx.com/b250d159-e1b6-4a87-9002-885d90033be3
  URL.revokeObjectURL(tempURL);
  return id.substr(id.lastIndexOf('/') + 1);
}

export default defineComponent({
  setup() {
    const store = useStore();
    const router = useRouter();
    // eslint-disable-next-line
    const axios: any = inject('axios'); // inject axios

    const message = useMessage();
    const loadingBar = useLoadingBar();
    const loginLoading = ref(false);

    const salt = uuid();
    const loginFormRef = ref(null);
    const loginForm = ref({
      uname: '',
      upwd: '',
    });
    const normalLogin = () => {
      (loginFormRef.value as unknown as InstanceType<typeof NForm>).validate(async (errors) => {
        if (errors) {
          message.error('请输入合法的账号密码');
        } else {
          // eslint-disable-next-line new-cap
          const shaObj = new jsSHA('SHA-512', 'TEXT', { encoding: 'UTF8' });
          shaObj.update(Md5.init(loginForm.value.upwd) + salt);
          const pwdWithSalt = shaObj.getHash('HEX');

          loginLoading.value = true;
          loadingBar.start();
          const { data: res } = await axios.post('/auth/login_normal', {
            uname: loginForm.value.uname,
            upwd: pwdWithSalt,
            salt,
          });
          loadingBar.finish();
          loginLoading.value = false;

          if (res.code !== 200) {
            message.error(
              res.msg,
              {
                duration: 2000,
              },
            );
          } else {
            const { uid, authority, token } = res.data;
            store.commit('setUserInfo', { uid, authority, token });
            message.success(
              '登陆成功',
              {
                duration: 2000,
              },
            );
            router.push('/').then();
          }
        }
      });
    };

    const otherLoginMethodNotImplement = () => {
      message.warning('还没有实现，以后再说吧');
    };
    const seuLogin = () => {
      otherLoginMethodNotImplement();
    };
    const qqLogin = () => {
      otherLoginMethodNotImplement();
    };

    return {
      loginLoading,

      loginFormRef,
      loginForm,
      normalLogin,
      rules,
      // eslint-disable-next-line global-require
      seu_login_img_url: require('../assets/seu-login.png'),
      // eslint-disable-next-line global-require
      qq_login_img_url: require('../assets/qq-login.png'),
      // eslint-disable-next-line global-require
      urcp_logo_img_url: require('../assets/logo.png'),

      seuLogin,
      qqLogin,
    };
  },
});
</script>

<style scoped>
.background {
  width: 100%;
  height: 100%;
  background-image: url("../assets/login_background.jpg");
  background-size: 100% 100%;
  background-attachment:fixed;
  background-repeat:no-repeat;
  -moz-background-size:100% 100%;
  -webkit-background-size:100% 100%;
}

.logoDiv {
  position: absolute;
  top: 10%;
  left: 5%;
}

.logo {
  border-radius: 50%;
  height: 100px;
  width: 100px;
}

.loginCard {
  position: absolute;
  width: 25%;
  left: 60%;
  top: 25%;
  background-color: rgb(255, 255, 255);
  border-bottom-color: rgb(238, 238, 238);
  border-bottom-style: solid;
  border-bottom-width: 2px;
  border-image-repeat: stretch;
  border-image-source: none;
  border-left-color: rgb(238, 238, 238);
  border-left-style: solid;
  border-left-width: 2px;
  border-right-color: rgb(238, 238, 238);
  border-right-style: solid;
  border-right-width: 2px;
  border-top-color: rgb(238, 238, 238);
  border-top-style: solid;
  border-top-width: 2px;
  font-family: helvetica, arial, 微软雅黑, 华文黑体, sans-serif;
  font-size: 12px;
}

.loginTitle {
  font-size: 20px;
  color: #333;
  margin-bottom: 16px;
  margin-top: 16px;
}

.loginFormBox {
  margin: 16px auto;
  width: 80%;
}

.otherLoginMethod {
  margin: 10px auto;
  width: 80%;
}

.otherLoginMethodLogo {
  height: 30px;
  width: 30px;
}

@font-face {
  font-family: 'webfont';
  font-display: swap;
  src: url('//at.alicdn.com/t/webfont_3ponpjs1naa.eot'); /* IE9*/
  src: url('//at.alicdn.com/t/webfont_3ponpjs1naa.eot?#iefix') format('embedded-opentype'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.woff2') format('woff2'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.woff') format('woff'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.ttf') format('truetype'),
  url('//at.alicdn.com/t/webfont_3ponpjs1naa.svg#Alibaba-PuHuiTi-Regular') format('svg');
}

.web-font{
  font-family:"webfont",serif !important;
  font-size:20px;font-style:normal;
  -webkit-font-smoothing: antialiased;
  -webkit-text-stroke-width: 0.2px;
  -moz-osx-font-smoothing: grayscale;

  color: white;
  line-height: 50px;
}
</style>
