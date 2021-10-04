import { createApp } from 'vue';

import naive, { useLoadingBar } from 'naive-ui';
import axios from 'axios';
import VueAxios from 'vue-axios';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
import hljs from 'highlight.js';

import App from './App.vue';
import './registerServiceWorker';
import store from './store';
import router from './router';

const app = createApp(App);

app.use(naive);

// const loadingBar = useLoadingBar();
// https://www.npmjs.com/package/vue-axios
axios.defaults.baseURL = '/api';
axios.interceptors.request.use((config) => {
  // loadingBar.start();
  // eslint-disable-next-line no-param-reassign
  config.headers.Authorization = store.state.token;
  return config;
});
axios.interceptors.response.use((res) => {
  // loadingBar.finish();
  const { code } = res.data;
  if (code === 1001 || code === 1002 || code === 1003) {
    router.push('/login').then();
  }
  return res;
});
app.use(VueAxios, axios);

router.beforeEach((to, from, next) => {
  if (to.path !== '/' && to.path !== '/login' && store.state.token === '') {
    next({ path: 'login' });
    return;
  }
  next();
});
app.use(router);

app.use(store);

VMdEditor.use(githubTheme, {
  Hljs: hljs,
});
app.use(VMdEditor);

app.provide('axios', app.config.globalProperties.axios); // provide 'axios'

app.mount('#app');
