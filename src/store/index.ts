import { createStore } from 'vuex';

export default createStore({
  state: {
    uid: '',
    name: '',
    level: 0,
  },
  mutations: {
    clearUserInfo(state) {
      state.uid = '';
      state.name = '';
      state.level = 0;
    },
    setUserInfo(state, { uid, name, level }) {
      state.uid = uid;
      state.name = name;
      state.level = level;
    },
  },
  actions: {
  },
  modules: {
  },
});
