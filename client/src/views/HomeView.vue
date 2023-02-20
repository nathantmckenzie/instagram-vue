<template>
  <div class="homeContainer">
    <div class="navBar"><NavBar /></div>
    <div class="mainPage">
      <MainView
        v-bind:showModal="showModal"
        :updateModalStatus="updateModalStatus"
        @update-modal-status-test="updateModalStatus"
      />
    </div>
    {{ console.log("showmODAL", showModal) }}
    {{ console.log("STORE S T A T E", $store.state) }}
    <Modal v-if="showModal" class="absolute top-0 left-0 right-0 bottom-0 z-20" />
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
  data() {
    return {
      showModal: false,
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
