<template>
  <div class="container">
    <button @click="toggleShowDiv">Click me</button>

    {{ console.log("this.$store.state.posts", this.$store.state.posts) }}
    <div v-for="post in this.$store.state.posts" class="mb-20" :key="post && post.id">
      <Post :post="post" @update-modal-status="$emit('update-modal-status')" />
    </div>
    <button @click="toggleShowDiv">Click me</button>
  </div>
</template>

<script>
import Post from "../components/Post.vue";

export default {
  name: "MainView",
  components: {
    Post,
  },
  emits: ["update-show-div", "update-modal-status"],
  props: {
    showModal: Boolean,
    showDiv: Boolean,
  },
  computed: {
    console: () => console,
    window: () => window,
    // posts() {
    //   return this.$store.state.posts;
    // },
  },
  mounted() {
    this.$store.dispatch("getData");
  },
  methods: {
    toggleShowDiv() {
      this.$emit("update-show-div");
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
}

.container::-webkit-scrollbar {
  display: none;
}
</style>
