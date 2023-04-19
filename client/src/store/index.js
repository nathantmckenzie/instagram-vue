import { createStore } from "vuex";
import axios from "axios";
import { getAuth, getIdToken } from "firebase/auth";
const auth = getAuth();

export default createStore({
  state: {
    posts: [],
    stories: [],
    likes: [],
    targetUserFollowerMap: [],
    currentUser: [],
    currentUserFollowerMap: [],
    targetUser: [],
    userPosts: [],
    notifications: [],
    darkMode: false,
    token: "",
  },
  getters: {
    getToken: (state) => {
      return state.token;
    },
    getPostById: (state) => (id) => {
      return state.posts.find((post) => post.id === id);
    },
  },
  mutations: {
    updatePosts(state, posts) {
      state.posts = posts;
    },
    updateCurrentUserState(state, currentUser) {
      state.currentUser = currentUser;
    },
    updateStories(state, stories) {
      state.stories = stories;
    },
    updateProfileStories(state, stories) {
      state.stories = stories;
    },
    updateTargetUserFollowerMap(state, targetUserFollowerMap) {
      state.targetUserFollowerMap = targetUserFollowerMap;
    },
    updateCurrentUserFollowerMap(state, currentUserFollowerMap) {
      state.currentUserFollowerMap = currentUserFollowerMap;
    },
    updateProfileData(state, payload) {
      state.userPosts = payload.posts;
      state.targetUser = payload.userData;
      state.stories = payload.stories;
    },
    updateDarkMode(state) {
      state.darkMode = !state.darkMode;
    },
    updateNotifications(state, notifications) {
      state.notifications = notifications;
    },
    updateToken(state, token) {
      state.token = token;
    },
  },
  actions: {
    updateToken({ commit }) {
      return new Promise((resolve, reject) => {
        auth.onAuthStateChanged(function (user) {
          if (user) {
            user
              .getIdToken(true)
              .then((idToken) => {
                commit("updateToken", idToken);
                resolve(); // resolve the Promise once token is updated
              })
              .catch(function (error) {
                reject(error);
              });
          } else {
            reject(new Error("User not authenticated"));
          }
        });
      });
    },
    getAbout({ commit }) {
      auth.onAuthStateChanged(function (user) {
        if (user) {
          user
            .getIdToken(true)
            .then((idToken) => {
              return axios
                .get("http://localhost:7002/aboutsomething", {
                  headers: {
                    Authorization: idToken,
                  },
                })
                .then((res) => {
                  commit("updatePosts", res.data.posts.rows);
                });
            })
            .catch(function (error) {
              console.log(error);
            });
        }
      });
    },
    getData({ commit, getters }) {
      const token = getters.getToken;
      console.log("WHY NO TOKEN", token);
      return axios("http://localhost:7002/", {
        headers: {
          Authorization: token,
        },
      }).then((res) => {
        console.log("LETSS GOOO", res.data);
        commit("updatePosts", res.data.posts.rows);
        commit("updateCurrentUserState", res.data.user.rows[0]);
      });
    },
    getStories({ commit }) {
      return axios("http://localhost:7002/").then((res) => {
        commit("updateStories", res.data.stories.rows);
      });
    },
    getProfileStories({ commit }, userID) {
      return axios(`http://localhost:7002/stories/${userID}`).then((res) => {
        commit("updateProfileStories", res.data.stories.rows);
      });
    },
    getTargetUserFollowerMap({ commit }, username) {
      return axios(`http://localhost:7002/getFollowingList/${username}`).then((res) => {
        const payload = {
          followers: res.data.followerList.rows,
          following: res.data.followingList.rows,
        };
        commit("updateTargetUserFollowerMap", payload);
      });
    },
    getCurrentUserFollowerMap({ commit, getters }) {
      const token = getters.getToken;
      return axios("http://localhost:7002/", {
        headers: {
          Authorization: token,
        },
      }).then((res) => {
        const payload = {
          followers: res.data.followerList.rows,
          following: res.data.followingList.rows,
        };
        commit("updateCurrentUserFollowerMap", payload);
      });
    },
    getProfileData({ commit }, username) {
      console.log("USERNAME", username);
      return axios(`http://localhost:7002/profile/${username}`).then((res) => {
        console.log("RESS", res);
        const payload = {
          userData: res.data.userData.rows[0],
          posts: res.data.posts.rows,
          stories: res.data.stories.rows,
        };
        commit("updateProfileData", payload);
      });
    },
    updateDarkMode({ commit }) {
      commit("updateDarkMode");
    },
    updateNotifications({ commit }, results) {
      commit("updateNotifications", results);
    },
  },
  modules: {},
});
