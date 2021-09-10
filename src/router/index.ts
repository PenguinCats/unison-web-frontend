import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '../views/Home.vue';
import ComputeResourceFramework from '../views/ComputeResource/ComputeResourceFramework.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/resource',
    name: 'ComputeResource',
    component: ComputeResourceFramework,
    redirect: '/resource/host',
    children: [
      {
        path: 'host',
        name: 'HostList',
        component: Home,
      },
      {
        path: 'instance',
        name: 'ComputeInstance',
        component: Home,
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
