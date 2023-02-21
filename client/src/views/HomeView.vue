<template>
  <div class="homeContainer">
    <div class="navBar"><NavBar /></div>
    <div class="mainPage">
      <MainView
        v-bind:showModal="showModal"
        :updateModalStatus="updateModalStatus.bind(this)"
        @update-modal-status="this.updateModalStatus"
        :show-div="showDiv"
        @update-show-div="updateShowDiv"
      />
    </div>
    {{ console.log("showDiv", this.showDiv) }}
    <div v-if="this.showModal">
      {{ console.log("this.showModal", this.showModal) }}
      <Modal class="absolute top-0 left-0 right-0 bottom-0 z-20" />
    </div>
    <div v-if="this.showDiv">
      {{ console.log(`showDiv is ${this.showDiv}`) }}
      <div>this div is rendered conditionally based on the prop value</div>
    </div>
    <div class="stories">Stories</div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import MainView from "./MainView.vue";
import Modal from "../components/Modal.vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    MainView,
    Modal,
  },
  emits: {},
  data() {
    return {
      showModal: true,
      showDiv: false,
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
  methods: {
    updateModalStatus() {
      this.showModal = !this.showModal;
      console.log("this.showModal", this.showModal);
    },
    updateShowDiv() {
      console.log("HIII");
      this.showDiv = !this.showDiv;
    },
  },
};
</script>

<style scoped>
.homeContainer {
  display: flex;
  z-index: 0;
  height: 100%;
}

.container::-webkit-scrollbar {
  display: none;
}

.navBar {
  width: 20%;
  height: 100vh;
  border-style: solid;
  position: relative;
}

.modal {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
}

.mainPage {
  width: 60%;
  border-style: solid;
  display: flex;
  justify-content: center;
  flex-direction: row;
  overflow: scroll;
  background-color: white;
  position: relative;
  z-index: 0;
  height: 100%;
}

.stories {
  width: 20%;
  border-style: solid;
  position: relative;
  z-index: 0;
}

@media (min-width: 0px) and (max-width: 1100px) {
  .mainPage {
    width: 100%;
  }

  .navBar {
    display: none;
  }

  .stories {
    display: none;
  }
}
</style>
