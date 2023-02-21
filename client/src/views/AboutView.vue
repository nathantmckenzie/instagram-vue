<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="toggleShowDiv">Click me</button>
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
