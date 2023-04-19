<template>
  <div class="container">
    <img class="profile-picture" :src="story.user.profile_picture" />
    <div class="username">{{ shortenedUsername(story.user.name) }}</div>
  </div>
</template>

<script>
export default {
  name: "StoryComponent",
  props: {
    story: Object,
  },
  methods: {
    shortenedUsername(username) {
      if (username.length > 8) {
        return `${username.slice(0, 8)}...`;
      }
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  align-items: center;
}
.profile-picture {
  width: 60px;
  border-radius: 50%;
  margin-right: 10px;
}

.username {
  font-size: 12px;
}
</style>
