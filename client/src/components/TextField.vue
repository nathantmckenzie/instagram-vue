<template>
  <form @submit.prevent="addCommentToPost">
    <textarea
      placeholder="Add a comment..."
      :value="value"
      @input="$emit('update:value', $event.target.value)"
      @keyup.enter="addCommentToPost"
    />
    <button v-if="value.length > 0" class="post-button">Post</button>
  </form>
</template>

<script>
export default {
  name: "TextField",
  props: {
    addCommentToPost: Function,
    value: String,
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
form {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
}

textarea {
  border: none;
  outline: none;
  width: 90%;
  word-wrap: break-word;
  resize: none;
  font-family: "Helvetica Neue", sans-serif;
}

.post-button {
  color: blue;
}
</style>
