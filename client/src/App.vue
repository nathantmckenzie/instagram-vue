<template>
  <div :class="this.$store.state.darkMode ? 'dark-mode-container' : 'container'">
    <router-view />
    <!-- <label>
      <input type="checkbox" @click="updateDarkMode" />
      Dark Mode
    </label> -->
  </div>
</template>

<script>
import "./index.css";

export default {
  name: "app",
  data() {
    return {
      users: [],
      posts: [],
    };
  },
  methods: {
    updateDarkMode() {
      this.$store.dispatch("updateDarkMode");
    },
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
.container {
  height: 100vh;
}

.dark-mode-container {
  background-color: black;
  color: white;
}
</style>
