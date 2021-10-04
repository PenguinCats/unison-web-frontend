import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Login from '../views/Login.vue';
import Frame from '../views/Frame/Frame.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: '',
    redirect: '/frame',
  },
  {
    path: '/frame',
    name: 'Home',
    component: Frame,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'Index',
        component: () => import('../views/Frame/Index/Index.vue'),
      },
      {
        path: '/resource',
        name: 'ComputeResource',
        component: () => import('../views/Frame/ComputeResource/ComputeResourceFramework.vue'),
        redirect: '/resource/host',
        children: [
          {
            path: 'host',
            name: 'HostList',
            component: () => import('../views/Frame/ComputeResource/HostList.vue'),
          },
          {
            path: 'instance',
            name: 'ComputeInstance',
            component: () => import('../views/Frame/ComputeResource/Instance.vue'),
          },
        ],
      },
      {
        path: '/message',
        name: 'Message',
        component: () => import('../views/Frame/Message/Message.vue'),
        redirect: '/message/inbox',
        children: [
          {
            path: 'inbox',
            name: 'Inbox',
            component: () => import('../views/Frame/Message/Inbox.vue'),
          },
        ],
      },
      {
        path: '/help',
        name: 'About',
        component: () => import('../views/Frame/Help/Help.vue'),
      },
      {
        path: '/user',
        name: 'User',
        component: () => import('../views/Frame/User/User.vue'),
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
