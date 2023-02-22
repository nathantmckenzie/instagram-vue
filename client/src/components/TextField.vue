<template>
  <form @submit.prevent="addCommentToPost" class="flex justify-between mx-5">
    <input
      placeholder="Add a comment..."
      :value="value"
      @input="$emit('update:value', $event.target.value)"
    />
    <button>Post</button>
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

<style scoped></style>
