<template>
  <div
    class="w-full h-full border-2 border-black mt-20 mb-20 flex flex-col items-between relative"
  >
    <div class="flex justify-between m-1">
      <div>
        <img />
        <div>
          <b>{{ post.user.name }}</b>
        </div>
      </div>
      <ellipsis-button />
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6 absolute bg-black z-20 left-0 bottom-2/4"
      @click="getPreviousImage"
      v-if="currentImage !== 0"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M11.25 9l-3 3m0 0l3 3m-3-3h7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <img :src="images[currentImage]" class="mt-10 w-[600px] h-96 object-cover" />
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
      class="w-6 h-6 absolute bg-black z-20 right-0 bottom-2/4"
      @click="getNextImage"
      v-if="currentImage !== images.length - 1"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M12.75 15l3-3m0 0l-3-3m3 3h-7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <div class="flex flex-row absolute z-20 left-2/4 bottom-1/3">
      <div :key="index" v-for="(photo, index) in images.length">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          :fill="currentImage === index ? 'black' : 'grey'"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="currentColor"
          class="w-4 h-4"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
    </div>
    <div class="flex justify-between m-2">
      <div class="flex flex-row">
        <like-button :isLiked="this.isLiked" @click="clickLikeButton" />
        <comment-button @click="$emit('update-modal-status')" />
        <button class="icons">Send</button>
      </div>
      <button>Save</button>
    </div>
    <div class="ml-1" v-if="post.likes?.length > 1">
      Liked by
      {{ isLiked ? "Nathan McKenzie" : post.likes[0]?.user.name }}
      <span @click="clickOtherLikesButton">and others</span>
    </div>
    <div class="ml-1" v-else>
      Liked by {{ isLiked ? "Nathan McKenzie" : post.likes[0]?.user.name }}
    </div>
    <div class="m-1">
      <b>{{ post.user.name }}</b> {{ post.content }}
    </div>
    <div :key="comment?.id" class="m-1" v-for="comment in post.comments">
      <div>
        <b>{{ comment?.user.name }}</b> {{ comment?.content }}
      </div>
    </div>
    <text-field />
  </div>
</template>

<script>
import Modal from "./Modal.vue";
import LikeButton from "./LikeButton.vue";
import CommentButton from "./CommentButton.vue";
import EllipsisButton from "./EllipsisButton.vue";
import TextField from "./TextField.vue";

import axios from "axios";

export default {
  emits: ["update-modal-status"],
  props: {
    post: Object,
    showModal: Boolean,
  },
  components: {
    Modal,
    LikeButton,
    CommentButton,
    EllipsisButton,
    TextField,
  },
  created() {
    const showModal = this.showModal;
  },
  mounted() {
    this.isLiked = this.verifyUserLikedPost();
  },
  methods: {
    verifyUserLikedPost() {
      console.log(
        "LIKEDD",
        this.post.likes?.some((object) => object.user.id === 1)
      );
      this.$store.dispatch("getData");
      if (this.post.likes?.some((object) => object.user.id === 1)) {
        return true;
      } else {
        return false;
      }
    },
    clickLikeButton() {
      const userLikedPost = this.post.likes?.some((object) => object.user.id === 1);
      console.log("userLikedPost", userLikedPost);
      if (!userLikedPost) {
        console.log("THE POST IS NOW LIKED");
        this.isLiked = true;
        axios
          .post("http://localhost:7002/likePost", { target_id: this.post.id, user_id: 1 })
          .then((res) => {
            console.log("hi", res);
            this.$store.dispatch("getData");
          });
      } else {
        console.log("THE POST IS NOW UNLIKED");
        this.isLiked = false;
        axios
          .post("http://localhost:7002/removeLikePost", {
            target_id: this.post.id,
            user_id: 1,
          })
          .then((res) => {
            console.log("BYE", res);
            this.$store.dispatch("getData");
          });
      }
    },
    clickOtherLikesButton() {
      console.log(
        "OTHER LIKES",
        this.post.likes?.map((like) => like.user.name)
      );
    },
    getNextImage() {
      if (this.currentImage + 1 < this.images.length) {
        this.currentImage += 1;
      }
    },

    getPreviousImage() {
      if (this.currentImage > 0) {
        this.currentImage -= 1;
      }
    },
  },
  data() {
    return {
      isLiked: false,
      currentImage: 0,
      images: [
        "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
        "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
        "https://www.nerdwallet.com/ca/wp-content/uploads/sites/2/2021/09/types-of-houses-in-canada-e1631808979346-1536x637.jpg",
      ],
    };
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

.icons {
  margin: 5px;
}
.liked-by-row {
  margin-left: 5px;
}
.top-bar {
  display: flex;
  justify-content: space-between;
  margin: 10px;
}
.top-bar-left-side {
  display: flex;
  flex-direction: row;
}
.container {
  width: 600px;
  height: 700px;
  border: solid #000;
  border-width: 3px 3px;
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: space-between;
}
.post-image {
  margin-top: 30px;
  width: 100%;
}
.icon-row {
  display: flex;
  justify-content: space-between;
}
</style>
