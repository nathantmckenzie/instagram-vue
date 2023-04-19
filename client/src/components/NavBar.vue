<template>
  <div>
    <nav class="container">
      <div class="link">Linkup</div>
      <router-link to="/" :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'">
        <div><HomeIcon class="image" />Home</div>
      </router-link>
      <!-- <router-link
      to="/profile/1"
      :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
      >Notifications</router-link
    > -->
      <router-link
        :to="'/' + this.$store.state.currentUser.username"
        :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
      >
        <div class="profile-picture-label">
          <img
            :src="this.$store.state.currentUser.profile_picture"
            class="profile-picture"
          />
          <span>Profile</span>
        </div></router-link
      >
      <router-link
        to="/login"
        :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
        @click="logout"
      >
        Log out
      </router-link>
    </nav>
  </div>
</template>

<script>
import HomeIcon from "./HomeIcon.vue";
import { signOut, getAuth } from "firebase/auth";

export default {
  name: "NavBar",
  components: {
    HomeIcon,
  },
  data() {
    return {
      currentUser: null,
    };
  },
  created() {
    const auth = getAuth();

    auth.onAuthStateChanged((user) => {
      if (user) {
        this.currentUser = user;
      } else {
        this.currentUser = null;
      }
    });
  },
  methods: {
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);
        this.$store.state.currentUser = [];
        this.$store.state.posts = [];
        this.$store.state.targetUserFollowerMap = [];
        this.$store.state.stories = [];
        this.$store.state.userPosts = [];
        this.$store.state.targetUser = [];
        this.$store.state.targetUserFollowerMap = [];
      } catch (err) {
        console.error(err);
      }
    },
  },
  computed: {
    console: () => console,
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}

.link {
  color: black;
  text-decoration: none;
  margin-bottom: 10px;
  font-size: 20px;
}

.dark-mode {
  color: white;
}

.image {
  width: 30px;
  fill: black;
  margin-right: 10px;
}

.profile-picture {
  width: 30px;
  border-radius: 50%;
  margin-right: 10px;
}

.profile-picture-label {
  display: flex;
  align-items: center;
}
</style>
