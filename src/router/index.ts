import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
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
            component: Home,
          },
        ],
      },
      {
        path: '/inbox',
        name: 'Inbox',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Frame/Inbox/Inbox.vue'),
      },
      {
        path: '/help',
        name: 'About',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/Frame/Help/Help.vue'),
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
