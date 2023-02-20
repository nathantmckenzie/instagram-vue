import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    counter: 100,
    posts: [],
  },
  getters: {},
  mutations: {
    incrementBy150(state) {
      state.counter += 150;
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
  },
  actions: {
    getData({ commit }) {
      axios("http://localhost:7002/").then((res) => {
        console.log("RESSS", res.data.posts.rows);
        commit("updatePosts", res.data.posts.rows);
      });
    },
  },
  modules: {},
});
