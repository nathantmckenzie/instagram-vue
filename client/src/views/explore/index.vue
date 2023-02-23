<template>
  <div class="about">
    <h1>Location</h1>
    <div>Top posts</div>
  </div>
</template>

<script>
export default {
  name: "AboutView",
  methods: {
    toggleShowDiv() {
      this.$emit("update-show-div");
    },
  },
};
</script>
