<template>
  <div class="container">
    <div class="stories">
      <Story
        v-for="story in this.$store.state.stories"
        :key="story.id"
        @click="getStories"
        :story="story"
      />
    </div>
    <div v-for="post in this.$store.state.posts" class="posts" :key="post.id">
      <Post
        :post="post"
        @update-modal-status="$emit('update-modal-status')"
        v-on:likes-updated="this.$emit('likes-updated', $event)"
        :getProfile="getProfile"
      />
    </div>
  </div>
</template>

<script>
import Post from "../components/Post.vue";
import Story from "../components/Story.vue";

export default {
  name: "MainView",
  components: {
    Post,
    Story,
  },
  emits: ["update-show-div", "update-modal-status"],
  props: {
    showModal: Boolean,
    getProfile: Function,
  },
  computed: {
    console: () => console,
    window: () => window,
  },
  methods: {
    getStories() {
      this.$router.push({ name: "stories" });
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  overflow: none;
}

.container::-webkit-scrollbar {
  display: none;
}

.posts {
  margin-bottom: 20px;
}

.stories {
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
</style>
