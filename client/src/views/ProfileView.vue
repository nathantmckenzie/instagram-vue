<template>
  <div>
    <div class="top-section">
      {{ console.log("this.profile", profile) }}
      <img :src="user.profile_picture" class="profilePicture" />
      <div>
        <div class="row">
          <div class="username">{{ user.name }}</div>
          <button>Edit profile</button>
          <button>Settings</button>
        </div>
        <div class="row">
          <div class="margin-right">{{ userPosts.length }} posts</div>
          <div class="margin-right">{{ followers }} followers</div>
          <div class="margin-right">{{ following }} following</div>
        </div>
        <div class="row">
          <div class="name">{{ user.name }}</div>
        </div>
      </div>
    </div>
    <div class="main-section">
      <div>
        <button>POSTS</button>
        <button>REELS</button>
        <button>TAGS</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileView",
  methods: {},
  mounted() {
    console.log("hi");
    this.$store.dispatch("getFollowingList");
    this.$store.dispatch("getProfileData");
  },
  computed: {
    console: () => console,
    window: () => window,
    user: function () {
      return this.$store.state.user;
    },
    userPosts: function () {
      return this.$store.state.userPosts;
    },
    profile: function () {
      return this.$store.state.profile;
    },
    followers: function () {
      return this.$store.state.followList.followers
        ? this.$store.state.followList.followers.length
        : 0;
    },
    following: function () {
      return this.$store.state.followList.following
        ? this.$store.state.followList.following.length
        : 0;
    },
  },
};
</script>

<style scoped>
.profilePicture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
}

.top-section {
  display: flex;
  justify-content: center;
}

.main-section {
  display: flex;
  justify-content: center;
  margin-top: 50px;
}

.username {
  font-size: 20px;
}

.row {
  display: flex;
  flex-direction: row;
}

button {
  height: 30px;
  margin-left: 10px;
}

.margin-right {
  margin-right: 10px;
}

.name {
  margin-top: 10px;
  margin-left: 10px;
}
</style>
