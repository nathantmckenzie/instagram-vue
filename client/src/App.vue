<template>
  <div class="container">
    <HomeView />
  </div>
</template>

<script>
import HomeView from "./views/HomeView.vue";
import "./index.css";

export default {
  name: "app",
  data() {
    return {
      users: [],
      posts: [],
    };
  },
  components: {
    HomeView,
  },
  methods: {},
  created() {
    this.$store.dispatch("getData");
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
</style>
