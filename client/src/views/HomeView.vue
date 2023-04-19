<template>
  <div class="home-container">
    <div class="nav-bar"><NavBar /></div>
    <div class="main-page">
      <MainView
        v-bind:showModal="showModal"
        :updateModalStatus="updateModalStatus"
        @update-modal-status="this.updateModalStatus"
        v-on:likes-updated="handleLikesUpdated"
        :getProfile="getProfile"
      />
      <dialog class="modal" ref="modalContainer">
        <div @click="closeModal">x</div>
        <div class="inner-modal">
          <h1>Likes</h1>
          <ul>
            <li v-for="like in likes" :key="like.id" class="like-row">
              <div
                class="profile-picture-username"
                @click="getProfile(like.user.username)"
              >
                <img :src="like.user.profile_picture" class="profile-picture" />
                {{ like.user.username }}
              </div>
              <button
                v-if="like.user.id !== 1"
                @click="
                  followListIDs.includes(like.user.id)
                    ? unfollow(like.user.id, this.$store.state.currentUser.id)
                    : follow(like.user.id, this.$store.state.currentUser.id)
                "
              >
                {{ followListIDs.includes(like.user.id) ? "Following" : "Follow" }}
              </button>
            </li>
          </ul>
        </div>
      </dialog>
    </div>
    <!-- <div class="stories">Stories</div> -->
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import MainView from "./MainView.vue";
import AboutView from "./AboutView.vue";

import axios from "axios";

export default {
  name: "HomeView",
  components: {
    NavBar,
    MainView,
    AboutView,
  },
  emits: {},
  data() {
    return {
      showModal: false,
      likes: [],
      followListIDs: [],
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
  mounted() {
    this.$store.dispatch("updateToken").then(() => {
      this.$store.dispatch("getData");
      this.$store.dispatch("getCurrentUserFollowerMap");
    });
    // this.$store.dispatch("getStories");
  },
  methods: {
    updateModalStatus() {
      this.$refs.modalContainer.showModal();
    },
    closeModal() {
      this.$refs.modalContainer.close();
    },
    async handleLikesUpdated(likes) {
      this.likes = likes;
      await this.$store.dispatch(
        "getTargetUserFollowerMap",
        this.$store.state.currentUser.id
      );
      this.followListIDs = this.$store.state.targetUserFollowerMap.following.map(
        (item) => item.target_id
      );
    },
    follow(targetID, followerID) {
      axios
        .post("http://localhost:7002/follow", {
          target_id: targetID,
          follower_id: followerID,
        })
        .then(() => {
          this.$store.dispatch("getTargetUserFollowerMap").then(() => {
            this.followListIDs = this.$store.state.targetUserFollowerMap.following.map(
              (item) => item.target_id
            );
          });
        });
    },
    unfollow(targetID, followerID) {
      axios
        .post("http://localhost:7002/unfollow", {
          target_id: targetID,
          follower_id: followerID,
        })
        .then(() => {
          this.$store.dispatch("getTargetUserFollowerMap").then(() => {
            this.followListIDs = this.$store.state.targetUserFollowerMap.following.map(
              (item) => item.target_id
            );
          });
        });
    },
    getProfile(username) {
      // this.$store.dispatch("getFollowingList", username);
      this.$store.dispatch("getProfileData", username).then(() => {
        this.$nextTick(() => {
          this.$router.push({ name: "profile", params: { username } });
        });
      });
    },
  },
};
</script>

<style scoped>
.home-container {
  display: flex;
  z-index: 0;
  height: 100%;
}

.container::-webkit-scrollbar {
  display: none;
}

.nav-bar {
  margin-left: 20px;
  width: 20%;
  height: 100vh;
  border-right: 1px solid;
  position: relative;
}

.modal {
  width: 350px;
  height: 400px;
  border-radius: 10px;
}

.inner-modal {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.main-page {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  overflow: scroll;
  position: relative;
  z-index: 0;
  height: 100%;
}

.stories {
  width: 20%;
  border-style: solid;
  position: relative;
  z-index: 0;
}

.profile-picture {
  width: 30px;
  border-radius: 50%;
  margin-right: 5px;
}

.like-row {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.profile-picture-username {
  display: flex;
  align-items: center;
}

ul {
  margin-left: -30px;
}

@media (min-width: 0px) and (max-width: 1100px) {
  .main-page {
    width: 100%;
  }

  .nav-bar {
    display: none;
  }

  .stories {
    display: none;
  }
}
</style>
