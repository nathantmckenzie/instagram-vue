<template>
  <div
    class="w-full h-full border-2 border-black mt-20 mb-20 flex flex-col items-between relative"
  >
    <div class="flex justify-between m-1">
      <div class="flex flex-row">
        <img :src="post.user.profile_picture" class="rounded-full w-10 h-10 mr-3" />
        <div class="flex items-start flex-col">
          <div>
            <span>
              <b>{{ post.user.name }}</b></span
            >
            <span class="ml-1">{{ timeSinceCommentWasPosted(post.timestamp) }}</span>
          </div>
          <div>{{ post.location }}</div>
        </div>
      </div>
      <ellipsis-button />
    </div>
    <div v-if="post.id !== 1 && post.id !== 8">
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
    </div>
    <div v-if="post.id === 1 || post.id === 8">
      <div ref="videoContainer" class="video-container">
        <video
          ref="videoPlayer"
          width="320"
          height="240"
          autoplay
          muted
          @play="onPlay"
          @pause="onPause"
        >
          <source :src="post.content" type="video/mp4" />
          <source :src="post.content" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        <div class="play-overlay" v-if="!isVideoPlaying" @click="onOverlayClick">
          <svg class="play-button" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M26.109 14.016l-18.328-10.593c-1.172-.703-2.672-.141-2.672 1.328v21.094c0 1.469 1.5 2.031 2.672 1.328l18.328-10.594c1.078-.625 1.078-2.187 0-2.813z"
              fill="#fff"
            />
          </svg>
        </div>
      </div>
    </div>
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
        <like-button :isLiked="this.isLiked" @click="clickLikeButton" width="w-7" />
        <comment-button />
        <button class="icons">Send</button>
      </div>
      <button>Save</button>
    </div>
    <div class="ml-1" v-if="post.likes?.length > 1">
      Liked by
      {{ isLiked ? "Nathan McKenzie" : post.likes[0]?.user.name }}
      and <span @click="clickOtherLikesButton"><b>others</b></span>
    </div>
    <div class="ml-1" v-else-if="post.likes?.length === 1">
      Liked by {{ isLiked ? "Nathan McKenzie" : post.likes[0]?.user.name }}
    </div>
    <div class="m-1">
      <b>{{ post.user.name }}</b> {{ post.caption }}
    </div>
    <div v-if="post.comments?.length > 0">
      <div :key="comment.id" class="m-1" v-for="comment in post.comments">
        <div class="flex justify-between">
          <div>
            <b>{{ comment.user.name }}</b
            ><span class="ml-1" @dblclick="removeCommentFromPost">{{
              comment?.content
            }}</span>
          </div>
          <like-button width="w-4" class="mr-2" />
        </div>
        <div class="flex flex-row align-middle">
          <span class="mr-2">{{
            timeSinceCommentWasPosted(comment.timestamp, comment.content)
          }}</span>
          <button class="mr-2">Reply</button>
          <div class="hide-ellipsis">
            <ellipsis-button />
          </div>
        </div>
      </div>
    </div>
    <text-field
      :addCommentToPost="addCommentToPost"
      :value="textFieldInput"
      @update:value="textFieldInput = $event"
    />
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
    this.videoPlayer = this.$refs.videoPlayer;
    this.observer = new IntersectionObserver(this.handleIntersection, {
      threshold: this.intersectionRatio,
    });
    this.$nextTick(() => {
      this.observer.observe(this.$refs.videoContainer);
      this.videoPlayer.addEventListener("ended", () => {
        this.videoPlayer.currentTime = 0; // Reset the video playback to the beginning
        this.videoPlayer.play(); // Restart the video playback
      });

      // Add a click event listener to the video element
      this.videoPlayer.addEventListener("click", () => {
        // Check if the video is currently paused
        if (this.videoPlayer.paused) {
          // If the video is paused, play it
          this.videoPlayer.play();
        } else {
          // If the video is playing, pause it
          this.videoPlayer.pause();
        }
      });
    });
  },
  methods: {
    verifyUserLikedPost() {
      this.$store.dispatch("getData");
      if (this.post.likes?.some((object) => object.user.id === 1)) {
        return true;
      } else {
        return false;
      }
    },
    clickLikeButton() {
      const userLikedPost = this.post.likes?.some((object) => object.user.id === 1);
      if (!userLikedPost) {
        this.isLiked = true;
        axios
          .post("http://localhost:7002/likePost", { target_id: this.post.id, user_id: 1 })
          .then((res) => {
            this.$store.dispatch("getData");
          });
      } else {
        this.isLiked = false;
        axios
          .post("http://localhost:7002/removeLikePost", {
            target_id: this.post.id,
            user_id: 1,
          })
          .then((res) => {
            this.$store.dispatch("getData");
          });
      }
    },
    // clickLikeCommentButton() {
    //   const userLikedPost = this.post.likes?.some((object) => object.user.id === 1);

    // },
    clickOtherLikesButton() {
      this.likes = this.post.likes;
      console.log("OTHER LIKES", this.likes);
      this.$emit("likes-updated", this.likes);
      this.$emit("update-modal-status");
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
    addCommentToPost(e) {
      e.preventDefault();
      axios
        .post("http://localhost:7002/addCommentPost", {
          content: this.textFieldInput,
          user_id: 1,
          post_id: this.post.id,
        })
        .then(() => {
          this.textFieldInput = "";
          this.$store.dispatch("getData");
        });
    },
    removeCommentFromPost() {
      axios
        .post("http://localhost:7002/removeCommentPost", {
          user_id: 1,
          post_id: this.post.id,
        })
        .then((res) => {
          this.$store.dispatch("getData");
        });
    },
    timeSinceCommentWasPosted(time) {
      // Create a new date object from the timestamp in GMT
      const gmtDate = new Date(time);

      // Get the timezone offset for the PST timezone
      const pstOffset = -8 * 60; // PST is 8 hours behind GMT

      // Convert the timestamp from GMT to PST by subtracting the timezone offset
      const pstTimestamp = gmtDate.getTime() + pstOffset * 60 * 1000;

      const diffMs = new Date() - new Date(pstTimestamp);

      // Calculate the difference in seconds, minutes, hours, days, and weeks
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 7));

      if (diffSecs <= 1) {
        return "Now";
      } else if (diffSecs > 1 && diffSecs <= 59) {
        return `${diffSecs}s`;
      } else if (diffSecs > 59 && diffMins <= 59) {
        return `${diffMins}m`;
      } else if (diffMins > 59 && diffHours <= 23) {
        return `${diffHours}h`;
      } else if (diffHours > 23 && diffDays <= 6) {
        return `${diffDays}d`;
      } else if (diffDays > 6) {
        return `${diffWeeks}w`;
      }
    },
    showButton() {
      this.showEllipsis = true;
    },
    hideButton() {
      this.showEllipsis = false;
    },
    handleIntersection(entries) {
      console.log("VIDEO INTERSECTED");
      if (entries[0].intersectionRatio >= this.intersectionRatio) {
        this.videoPlayer.play();
      } else {
        this.videoPlayer.pause();
      }
    },
    onPlay() {
      this.isVideoPlaying = true;
    },
    onPause() {
      this.isVideoPlaying = false;
    },
    onOverlayClick() {
      // When the overlay is clicked, hide the overlay and play the video
      this.isVideoPlaying = true;
      this.$refs.videoPlayer.play();
    },
  },
  data() {
    return {
      isVideoPlaying: false,
      intersectionRatio: 0.5,
      videoPlayer: null,
      observer: null,
      showEllipsis: false,
      isLiked: false,
      currentImage: 0,
      textFieldInput: "",
      timeAgoComment: "",
      images: [
        "https://www.bhg.com/thmb/3Vf9GXp3T-adDlU6tKpTbb-AEyE=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/white-modern-house-curved-patio-archway-c0a4a3b3-aa51b24d14d0464ea15d36e05aa85ac9.jpg",
        "https://thumbor.forbes.com/thumbor/fit-in/900x510/https://www.forbes.com/home-improvement/wp-content/uploads/2022/07/download-23.jpg",
        "https://www.nerdwallet.com/ca/wp-content/uploads/sites/2/2021/09/types-of-houses-in-canada-e1631808979346-1536x637.jpg",
      ],
      likes: [],
    };
  },
  beforeUnmount() {
    this.observer.unobserve(this.$refs.videoContainer);
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
.hide-ellipsis {
  display: none;
}
.hide-ellipsis:hover {
  display: hide;
}

.video-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.play-overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.play-button {
  width: 50px;
  height: 50px;
  fill: #fff;
}
</style>
