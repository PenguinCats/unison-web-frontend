<template>
  <div class="background">
    <div class="logoDiv">
      <n-grid x-gap="12" :cols="4">
        <n-gi>
          <img :src="urcp_logo_img_url" class="logo" alt="URCP logo">
        </n-gi>
        <n-gi span="3">
          <div>
            <i class="web-font">衡·资源共享云平台</i>
          </div>
          <div>
            <i class="web-font">Unison Resource Cloud Platform</i>
          </div>
        </n-gi>
      </n-grid>
    </div>
    <div class="loginCard">
      <div class="loginTitle">登录</div>
      <div class="loginForm">
        <n-form :model="loginForm" label-placement="left" :label-width="100" size="medium"
                :rules="rules">
          <n-form-item path="uid">
            <n-input placeholder="用户名" v-model:value="loginForm.uid" type="text" round></n-input>
          </n-form-item>
          <n-form-item path="pwd">
            <n-input placeholder="密码" v-model:value="loginForm.pwd" type="password"
                     show-password-on="click" round></n-input>
          </n-form-item>
          <n-button type="primary" round style="width: 100%">登 录</n-button>
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

<script>
import { defineComponent } from 'vue';
import { useMessage } from 'naive-ui';

const rules = {
  uid: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur',
  },
  pwd: {
    required: true,
    message: '请输入密码',
    trigger: 'blur',
  },
};

export default defineComponent({
  setup() {
    const message = useMessage();

    const otherLoginMethodNotImplement = () => {
      message.warning('还没有实现，以后再说吧');
    };
    const seuLogin = () => {
      console.log('seu login');
      otherLoginMethodNotImplement();
    };
    const qqLogin = () => {
      console.log('qq login');
      otherLoginMethodNotImplement();
    };

    return {
      loginForm: {
        uid: '',
        pwd: '',
      },
      rules,
      // eslint-disable-next-line global-require
      seu_login_img_url: require('../assets/seu-login.png'),
      // eslint-disable-next-line global-require
      qq_login_img_url: require('../assets/qq-login.png'),
      // eslint-disable-next-line global-require
      urcp_logo_img_url: require('../assets/logo.png'),

      uid() {
        return this.$store.state.uid;
      },

      otherLoginMethodNotImplement,
      seuLogin,
      qqLogin,
    };
  },
});

// export default {
//   name: 'Login',
//   // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
//   data() {
//     return {
//       loginForm: {
//         uid: '',
//         pwd: '',
//       },
//       rules,
//       // eslint-disable-next-line global-require
//       seu_login_img_url: require('../assets/seu-login.png'),
//       // eslint-disable-next-line global-require
//       qq_login_img_url: require('../assets/qq-login.png'),
//     };
//   },
//   computed: {
//     uid() {
//       return this.$store.state.uid;
//     },
//   },
//   methods: {
//     otherLoginMethodNotImplement() {
//       // this.message.warning('How many roads must a man walk down');
//       message.warning('123');
//     },
//     seu_login() {
//       console.log('seu login');
//       this.otherLoginMethodNotImplement();
//     },
//     qq_login() {
//       console.log('qq login');
//       this.otherLoginMethodNotImplement();
//     },
//   },
// };
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

.loginForm {
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
  text-align: left;
}
</style>
