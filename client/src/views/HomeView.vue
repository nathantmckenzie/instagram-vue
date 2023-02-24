<template>
  <div class="homeContainer">
    <div class="navBar"><NavBar /></div>
    <div class="mainPage">
      <MainView
        v-bind:showModal="showModal"
        :updateModalStatus="updateModalStatus"
        @update-modal-status="this.updateModalStatus"
        v-on:likes-updated="handleLikesUpdated"
      />
      <!-- <Modal class="mt-1/2" innerRef="modalContainer" /> -->
      <dialog class="modal rounded" ref="modalContainer">
        <div @click="closeModal">x</div>
        <div class="innerModal">
          <h1>Likes</h1>
          <ul>
            <li v-for="like in likes" :key="like.id" class="likeRow">
              <img :src="like.user.profile_picture" class="profilePicture" />
              {{ like.user.name }}
            </li>
          </ul>
        </div>
      </dialog>
    </div>
    <div class="stories">Stories</div>
  </div>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import MainView from "./MainView.vue";
import Modal from "../components/Modal.vue";
import AboutView from "./AboutView.vue";

export default {
  name: "HomeView",
  components: {
    NavBar,
    MainView,
    Modal,
    AboutView,
  },
  emits: {},
  data() {
    return {
      showModal: false,
      hasEventListener: false,
      likes: [],
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
  methods: {
    updateModalStatus() {
      this.$refs.modalContainer.showModal();
    },
    closeModal() {
      this.$refs.modalContainer.close();
    },
    handleLikesUpdated(likes) {
      console.log("LIKES BABYYYY", likes);
      this.likes = likes;
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
  width: 350px;
  height: 400px;
  border-radius: 10px;
}

.innerModal {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.mainPage {
  width: 800px;
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

.profilePicture {
  width: 30px;
  border-radius: 50%;
}

.likeRow {
  margin-bottom: 20px;
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
