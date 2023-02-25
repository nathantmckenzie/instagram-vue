import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    counter: 100,
    posts: [],
    likes: [],
    followerList: [],
  },
  getters: {},
  mutations: {
    incrementBy150(state) {
      state.counter += 150;
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
    updateFollowerList(state, followerList) {
      state.followerList = followerList;
      console.log("line 21 mfff", state.followerList);
    },
  },
  actions: {
    getData({ commit }) {
      return axios("http://localhost:7002/").then((res) => {
        console.log("RESSS", res.data.posts.rows);
        commit("updatePosts", res.data.posts.rows);
      });
    },
    getFollowerList({ commit }) {
      return axios("http://localhost:7002/getFollowerList/1").then((res) => {
        console.log("FOLLOWER LIST!!!", res.data.followerList.rows);
        commit("updateFollowerList", res.data.followerList.rows);
      });
    },
  },
  modules: {},
});
