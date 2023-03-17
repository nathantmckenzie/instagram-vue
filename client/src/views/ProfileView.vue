<template>
  <div class="container" v-if="isDataReady">
    <div class="top-section">
      <img
        @click="goToProfileStories"
        :src="user.profile_picture"
        :class="userHasStories ? 'profile-picture with-background' : 'profile-picture'"
      />
      <div>
        <div class="row">
          <div class="username">{{ user.name }}</div>
          <button>Edit profile</button>
          <button>Settings</button>
        </div>
        <div class="row">
          <div class="margin-right">{{ userPosts.length }} posts</div>
          <div @click="updateFollowersModalStatus" class="margin-right">
            {{ followers }} followers
          </div>
          <div @click="updateFollowingModalStatus" class="margin-right">
            {{ following }} following
          </div>
        </div>
        <FollowModal
          :list="this.$store.state.followList.followers"
          title="Followers"
          @close-modal="closeModal"
          ref="followersModal"
        />
        <FollowModal
          :showFollowingModal="this.showFollowingModal"
          :list="this.$store.state.followList.following"
          title="Following"
          ref="followingModal"
        />
        <div class="row">
          <div class="name">{{ user.name }}</div>
        </div>
      </div>
    </div>
    <!-- <div class="main-section">
      <div class="buttons-row">
        <button>POSTS</button>
        <button>REELS</button>
        <button>TAGS</button>
      </div> -->
    <div class="images">
      <div v-for="post in this.$store.state.userPosts" :key="post.id">
        <div v-if="post.content_type === 1" @click="this.displayPostModal(post)">
          <img :src="post.content" class="image" />
          <div class="white-backdrop"></div>
          <div class="hover-image">
            &#x2665;&#xFE0F;{{ post.likes ? post.likes.length : 0 }} &#x1F4AC;{{
              post.comments ? post.comments.length : 0
            }}
          </div>
        </div>
        <video
          @click="this.displayPostModal(post)"
          v-else-if="post.content_type === 2"
          ref="videoPlayer"
          width="320"
          height="240"
          muted
        >
          <source :src="post.content" type="video/mp4" />
          <source :src="post.content" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        <!-- <div class="hover-image">
          &#x2665;&#xFE0F;{{ post.likes ? post.likes.length : 0 }} &#x1F4AC;{{
            post.comments ? post.comments.length : 0
          }}
        </div> -->
      </div>
    </div>
    <dialog class="modal-post" ref="postModal">
      <div class="modal-post-container">
        <div @click="closePostModal">x</div>
        <img
          v-if="this.displayedPost.content_type === 1"
          :src="this.displayedPost.content"
          class="modal-image"
        />
        <video
          v-else-if="this.displayedPost.content_type === 2"
          ref="videoPlayer"
          width="320"
          height="600"
          autoplay
          muted
        >
          <source :src="this.displayedPost.content" type="video/mp4" />
          <source :src="this.displayedPost.content" type="video/ogg" />
          Your browser does not support the video tag.
        </video>
        <div class="right-side-modal">
          <div>
            <div class="top-row-modal">
              <img
                :src="this.displayedPost?.user?.profile_picture"
                class="modal-profile-picture"
              />
              <div class="modal-user-name">
                <b>{{ this.displayedPost?.user?.name }}</b>
              </div>
            </div>
            <div v-if="this.displayedPost.caption">
              <div class="caption-section">
                <img
                  :src="this.displayedPost?.user?.profile_picture"
                  class="modal-profile-picture"
                />
                <div class="caption-columns">
                  <div class="caption-row">
                    <div>
                      <b>{{ this.displayedPost?.user?.name }}</b>
                    </div>
                    <div class="caption">{{ this.displayedPost.caption }}</div>
                  </div>
                  <div>{{ timeSinceCommentWasPosted(this.displayedPost.timestamp) }}</div>
                </div>
              </div>
            </div>
            <div>
              <div
                v-for="comment in this.displayedPost?.comments"
                :key="comment.id"
                class="comment-modal"
              >
                <img :src="comment.user.profile_picture" class="modal-profile-picture" />
                <div class="modal-comment-content">
                  <div>
                    <span
                      ><b>{{ comment.user.name }}</b></span
                    >
                    <span class="comment">{{ comment.content }}</span>
                  </div>
                  <div>
                    <span>{{ timeSinceCommentWasPosted(comment.timestamp) }}</span>
                    <span class="reply-button">Reply</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="bottom-section-modal">
            <div class="like-comment-share-row">
              <like-button
                :isLiked="this.isLiked"
                @click="clickLikeButton"
                width="large"
              />
              <comment-button width="large" />
              <button class="icons">Send</button>
            </div>
            <div v-if="this.displayedPost?.likes">
              <img
                :src="this.displayedPost?.likes[0].user.profile_picture"
                class="modal-profile-picture"
              />
              Liked by {{ this.displayedPost?.likes[0].user.name }}
              <span v-if="this.displayedPost?.likes.length > 1">and others</span>
            </div>
          </div>
        </div>
      </div>
    </dialog>
  </div>
  <!-- </div> -->
</template>

<script>
import LikeButton from "../components/LikeButton.vue";
import CommentButton from "../components/CommentButton.vue";
import EllipsisButton from "../components/EllipsisButton.vue";
import TextField from "../components/TextField.vue";
import FollowModal from "../components/FollowModal.vue";

import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      showFollowersModal: false,
      showFollowingModal: false,
      followListIDs: [],
      displayedPost: {},
      isLiked: false,
      userHasStories: false,
    };
  },
  components: {
    LikeButton,
    CommentButton,
    EllipsisButton,
    TextField,
    FollowModal,
  },
  methods: {
    updateFollowersModalStatus() {
      this.$refs.followersModal.$refs.modalContainer.showModal();
    },
    closeFollowersModal() {
      this.$refs.followersModal.$refs.modalContainer.close();
    },
    updateFollowingModalStatus() {
      this.$refs.followingModal.$refs.modalContainer.showModal();
    },
    closeFollowingModal() {
      this.$refs.followingModal.$refs.modalContainer.close();
    },
    displayPostModal(post) {
      this.$refs.postModal.showModal();
      this.displayedPost = post;
      this.isLiked = this.verifyUserLikedPost();
    },
    closePostModal() {
      this.$refs.postModal.close();
      this.$store.dispatch("getFollowingList");
      this.$store.dispatch("getProfileData");
    },
    unfollow(targetID, followerID) {
      axios
        .post("http://localhost:7002/unfollow", {
          target_id: targetID,
          follower_id: followerID,
        })
        .then(() => {
          this.$store.dispatch("getFollowingList").then(() => {
            this.followListIDs = this.$store.state.followList.following.map(
              (item) => item.target_id
            );
          });
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
    clickLikeButton() {
      this.isLiked = !this.isLiked;
      const userLikedPost = this.displayedPost.likes?.some(
        (object) => object.user.id === 1
      );
      if (!userLikedPost) {
        this.isLiked = true;
        axios
          .post("http://localhost:7002/likePost", {
            target_id: this.displayedPost.id,
            user_id: 1,
          })
          .then(() => {
            this.$store.dispatch("getData");
            axios
              .get(`http://localhost:7002/post/${this.displayedPost.id}`)
              .then((res) => {
                this.displayedPost = res.data.post.rows[0];
              });
          });
      } else {
        this.isLiked = false;
        axios
          .post("http://localhost:7002/removeLikePost", {
            target_id: this.displayedPost.id,
            user_id: 1,
          })
          .then(() => {
            this.$store.dispatch("getData");
            axios
              .get(`http://localhost:7002/post/${this.displayedPost.id}`)
              .then((res) => {
                this.displayedPost = res.data.post.rows[0];
              });
          });
      }
    },
    verifyUserLikedPost() {
      if (this.displayedPost.likes?.some((object) => object.user.id === 1)) {
        return true;
      } else {
        return false;
      }
    },
    goToProfileStories() {
      if (this.$store.state.stories.length > 0) {
        this.$router.push({
          name: "profile-stories",
          params: { userID: this.$store.state.user.id },
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch("getProfileData", this.$route.params.userID);
    this.$store.dispatch("getFollowingList", this.$route.params.userID);
    if (this.$store.state.stories.length > 0) {
      this.userHasStories = true;
    }
  },
  computed: {
    console: () => console,
    window: () => window,
    user: function () {
      return this.$store.state.user;
    },
    userPosts: function () {
      return this.$store.state.userPosts;
    },
    profile: function () {
      return this.$store.state.profile;
    },
    followers: function () {
      return this.$store.state.followList.followers
        ? this.$store.state.followList.followers.length
        : 0;
    },
    following: function () {
      return this.$store.state.followList.following
        ? this.$store.state.followList.following.length
        : 0;
    },
    isDataReady() {
      return (
        this.$store.state.stories &&
        this.$store.state.userPosts &&
        this.$store.state.followList.following &&
        this.$store.state.followList.followers
      );
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

ul {
  margin: 0;
  padding: 0;
}
.profile-picture {
  border-radius: 50%;
  width: 150px;
  height: 150px;
  margin-bottom: 30px;
}

.follower-profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 5px;
}

.with-background {
  background-color: red;
  padding: 5px;
  box-sizing: border-box;
}

.follow-modal-top-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
}

.top-section {
  display: flex;
  justify-content: center;
}

.main-section {
  display: flex;
  justify-content: center;
  margin-top: 50px;
  /* flex-direction: column; */
  /* align-items: center; */
}

.username {
  font-size: 20px;
}

.row {
  display: flex;
  flex-direction: row;
}

button {
  height: 30px;
  margin-left: 10px;
}

.margin-right {
  margin-right: 10px;
}

.name {
  margin-top: 10px;
  margin-left: 10px;
}

.image {
  width: 200px;
  height: 200px;
  position: relative;
  display: inline-block;
}

.modal-image {
  width: 400px;
  height: 550px;
  object-fit: cover;
}

.white-backdrop,
.hover-image {
  position: absolute;
  z-index: 1;
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translate(0%, -100%);
  opacity: 0;
}

.hover-image:hover {
  opacity: 1;
}

.white-backdrop:hover {
  opacity: 1;
  color: white;
  z-index: 10;
}

.images {
  display: grid;
  grid-template-columns: repeat(3, 300px);
  grid-gap: 5px;
  justify-content: center;
  align-content: center;
}

.buttons-row {
  display: flex;
  flex-direction: row;
}

.modal-post {
  width: 1000px;
  height: 600px;
  border-radius: 10px;
  /* display: flex; */
}

.modal-post-container {
  display: flex;
}

.modal-profile-picture {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.top-row-modal {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  margin-bottom: 15px;
}

.modal-user-name {
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.reply-button {
  margin-left: 5px;
}

.comment-modal {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  margin-bottom: 15px;
}

.modal-comment-content {
  margin-left: 10px;
}

.like-comment-share-row {
  display: flex;
  flex-direction: row;
}

.bottom-section-modal {
  margin-left: 15px;
}

.right-side-modal {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.caption-section {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  margin-bottom: 10px;
}

.caption-columns {
  display: flex;
  flex-direction: column;
  margin-left: 5px;
}

.caption-row {
  display: flex;
  flex-direction: row;
}

.caption {
  margin-left: 5px;
}

.comment {
  margin-left: 5px;
}

.follower-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

.profile-picture-username {
  display: flex;
  align-items: center;
}

.follow-modal {
  width: 25%;
  border-radius: 3%;
}

.follow-button {
  background-color: #0095f6;
  border-radius: 20%;
  color: white;
}
</style>
