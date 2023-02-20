<template>
  <div class="container">
    <div :key="post.id" v-for="post in $store.state.posts" class="mb-20">
      <Post
        :post="post"
        :showModal="showModal"
        @update-modal-status="$emit('update-modal-status-test')"
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
  props: {
    showModal: Boolean,
  },
  computed: {
    console: () => console,
    window: () => window,
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
