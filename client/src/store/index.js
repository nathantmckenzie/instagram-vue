import { createStore } from "vuex";
import axios from "axios";

export default createStore({
  state: {
    counter: 100,
    posts: [],
    likes: [],
    followList: [],
    user: [],
    userPosts: [],
  },
  getters: {},
  mutations: {
    incrementBy150(state) {
      state.counter += 150;
    },
    updatePosts(state, posts) {
      state.posts = posts;
    },
    updateFollowingList(state, followingList) {
      state.followList = followingList;
      console.log("STATE", state.followList);
    },
    updateProfileData(state, payload) {
      state.userPosts = payload.posts;
      state.user = payload.userData;
    },
  },
  actions: {
    getData({ commit }) {
      return axios("http://localhost:7002/").then((res) => {
        commit("updatePosts", res.data.posts.rows);
      });
    },
    getFollowingList({ commit }) {
      return axios("http://localhost:7002/getFollowingList/1").then((res) => {
        const payload = {
          followers: res.data.followerList.rows,
          following: res.data.followingList.rows,
        };
        commit("updateFollowingList", payload);
      });
    },
    getProfileData({ commit }) {
      return axios("http://localhost:7002/profile/1").then((res) => {
        const payload = {
          userData: res.data.userData.rows[0],
          posts: res.data.posts.rows,
        };
        commit("updateProfileData", payload);
      });
    },
  },
  modules: {},
});
