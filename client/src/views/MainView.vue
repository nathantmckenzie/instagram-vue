<template>
  <div class="container">
    {{ console.log("this.$store.state.posts", this.$store.state.posts) }}
    <div v-for="post in this.$store.state.posts" class="mb-20" :key="post && post.id">
      <Post
        :post="post"
        @update-modal-status="$emit('update-modal-status')"
        v-on:likes-updated="this.$emit('likes-updated', $event)"
      />
    </div>
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
  methods: {},
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
