<template>
  <nav class="nav-bar">
    <router-link to="/" :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'">
      <div><HomeIcon class="image" />Home</div>
    </router-link>
    <router-link
      to="/profile/1"
      :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
      >Notifications</router-link
    >
    <router-link
      to="/profile/1"
      :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
    >
      <img
        :src="this.$store.state.user.profile_picture"
        class="profile-picture"
      />Profile</router-link
    >
    <router-link
      to="/profile/1"
      :class="this.$store.state.darkMode ? 'link dark-mode' : 'link'"
      >Logout</router-link
    >
  </nav>
</template>

<script>
import HomeIcon from "./HomeIcon.vue";

export default {
  name: "NavBar",
  components: {
    HomeIcon,
  },
  created() {
    this.socket = new WebSocket("ws://localhost:8000/");
    this.socket.addEventListener("open", () => {
      console.log("WebSocket connection opened.");
    });
    this.socket.addEventListener("message", (event) => {
      console.log("WebSocket message received:", event.data);
      // Here you can call your Vuex action to update your state
      this.$store.dispatch("updateNotifications", event.data);
    });
    this.socket.addEventListener("close", () => {
      console.log("WebSocket connection closed.");
    });
  },
};
</script>

<style scoped>
.nav-bar {
  display: flex;
  flex-direction: column;
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
}

.profile-picture {
  width: 30px;
  border-radius: 50%;
}
</style>
