import { createApp } from 'vue';

import naive from 'naive-ui';

import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';

const app = createApp(App);
app.use(naive).use(store).use(router)
  .mount('#app');
