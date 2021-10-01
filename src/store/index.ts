import { createStore } from 'vuex';

export default createStore({
  state: {
    uid: 0,
    authority: 0,
    token: '',
  },
  getters: {
    isAdmin: (state): boolean => state.authority > 0 && state.authority <= 2,
    isRoot: (state): boolean => state.authority === 1,
    authorityIconType: ((state) => {
      if (state.authority === 1) {
        return 'error';
      }
      if (state.authority === 2) {
        return 'warning';
      }
      return 'info';
    }),
    authorityName: ((state) => {
      if (state.authority === 1) {
        return '超级管理员';
      }
      if (state.authority === 2) {
        return '管理员';
      }
      return '普通用户';
    }),
  },
  mutations: {
    clearUserInfo(state) {
      state.uid = 0;
      state.token = '';
      state.authority = 0;
    },
    setUserInfo(state, { uid, authority, token }) {
      state.uid = uid;
      state.authority = authority;
      state.token = token;
    },
  },
  actions: {
  },
  modules: {
  },
});
