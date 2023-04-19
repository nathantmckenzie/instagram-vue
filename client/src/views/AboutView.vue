<template>
  <div class="dialog-wrapper">
    <div class="dialog-arrows">
      <div class="left-arrow">&lt;</div>
      <div class="right-arrow">&gt;</div>
    </div>
    <dialog open>
      <p>This is the content of the dialog</p>
    </dialog>
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
  computed: {
    console: () => console,
    window: () => window,
  },
  mounted() {
    this.$store.dispatch("getAbout");
  },
};
</script>

<style scoped>
.dialog-wrapper {
  position: relative;
  height: 100vh;
}

dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 600px;
  background-color: #fff;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1;
}

.dialog-arrows {
  position: absolute;
  top: 50%;
  left: 10px;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 2;
}

.left-arrow,
.right-arrow {
  width: 30px;
  height: 30px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  pointer-events: auto;
}
</style>
