<template>
  <div class="container" v-if="isDataReady">
    <div class="nav-bar"><NavBar /></div>
    <div class="profile-section">
      <div class="top-section">
        <img
          @click="goToProfileStories"
          v-lazy="targetUser.profile_picture"
          :class="userHasStories ? 'profile-picture with-background' : 'profile-picture'"
        />
        <div>
          <div class="row">
            <div class="username">{{ targetUser.username }}</div>
            <div v-if="targetUser.id === currentUser.id">
              <button>Edit profile</button>
              <button>Settings</button>
            </div>
            {{ console.log("IS FOLLOWINGGG", this.isFollowing) }}
            <!-- <div v-else>
              <button v-if="this.">Following</button>
            </div> -->
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
          {{ console.log("255", this.$store.state.followList) }}
          <FollowModal
            :list="this.$store.state.followList.followers"
            title="Followers"
            @close-modal="closeModal"
            ref="followersModal"
            :getProfileFunction="getProfile"
            :follow="follow"
            :unfollow="unfollow"
            :followingListIDs="followingListIDs"
          />
          <FollowModal
            :showFollowingModal="this.showFollowingModal"
            :list="this.$store.state.followList.following"
            title="Following"
            ref="followingModal"
            :getProfileFunction="getProfile"
            :follow="follow"
            :unfollow="unfollow"
            :followingListIDs="followingListIDs"
          />
          <div class="row">
            <div class="name">{{ targetUser.name }}</div>
          </div>
        </div>
      </div>
      <!-- <div class="main-section">
      <div class="buttons-row">
        <button>POSTS</button>
        <button>REELS</button>
        <button>TAGS</button>
      </div> -->
      <div v-if="!this.targetUser.private_account">
        <div class="images">
          <div v-for="(post, index) of this.$store.state.userPosts" :key="post.id">
            <div
              v-if="post.content_type === 1"
              @click="this.displayPostModal(post, index)"
            >
              <img :src="post.content" class="image" />
              <div class="white-backdrop"></div>
              <div class="hover-image">
                &#x2665;&#xFE0F;{{ post.likes ? post.likes.length : 0 }} &#x1F4AC;{{
                  post.comments ? post.comments.length : 0
                }}
              </div>
            </div>
            <div v-else-if="post.content_type === 2">
              <video @click="this.displayPostModal(post, index)" class="video" muted>
                <source :src="post.content" type="video/mp4" />
                <source :src="post.content" type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
            <!-- <div class="hover-image">
          &#x2665;&#xFE0F;{{ post.likes ? post.likes.length : 0 }} &#x1F4AC;{{
            post.comments ? post.comments.length : 0
          }}
        </div> -->
          </div>
        </div>
        <dialog class="modal-post" ref="postModal">
          <dialog class="modal-likes" ref="likesModal">
            <div @click="closeLikesModal">x</div>
            <div class="inner-modal">
              <h1>Likes</h1>
              <ul>
                <li
                  v-for="like in this.displayedPost.likes"
                  :key="like.id"
                  class="like-row"
                >
                  <div
                    class="profile-picture-username"
                    @click="getProfile(like.user.username)"
                  >
                    <img
                      :src="like.user.profile_picture"
                      class="follower-profile-picture"
                    />
                    {{ like.user.username }}
                  </div>
                  <button
                    v-if="like.user.id !== this.$store.state.currentUser.id"
                    @click="
                      followingListIDs.includes(like.user.id)
                        ? unfollow(like.user.id, this.$store.state.currentUser.username)
                        : follow(like.user.id, this.$store.state.currentUser.username)
                    "
                  >
                    {{ followingListIDs.includes(like.user.id) ? "Following" : "Follow" }}
                  </button>
                </li>
              </ul>
            </div>
          </dialog>
          <div
            v-if="postModalDisplayed"
            :class="
              this.displayLeftArrow() ? 'dialog-arrows' : 'dialog-arrows-first-post'
            "
          >
            <img
              v-if="this.displayLeftArrow()"
              class="previous-post"
              @click="displayPreviousPost"
              :src="LeftArrow"
            />
            <img
              v-if="this.displayRightArrow()"
              class="next-post"
              @click="displayNextPost"
              :src="RightArrow"
            />
          </div>
          <div class="modal-post-container">
            <div @click="closePostModal">x</div>
            <img
              v-if="this.displayedPost.content_type === 1"
              :src="this.displayedPost.content"
              class="modal-image"
            />
            <div
              class="video-container"
              v-else-if="this.displayedPost.content_type === 2"
            >
              <video
                ref="videoPlayer"
                width="320"
                height="600"
                autoplay
                :muted="muted"
                @play="onPlay"
                @pause="onPause"
              >
                <source :src="this.displayedPost.content" type="video/mp4" />
                <source :src="this.displayedPost.content" type="video/ogg" />
                Your browser does not support the video tag.
              </video>
            </div>
            <div
              class="play-overlay"
              v-if="!isVideoPlaying && this.displayedPost.content_type === 2"
              @click="onOverlayClick"
            >
              <svg
                class="play-button"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M26.109 14.016l-18.328-10.593c-1.172-.703-2.672-.141-2.672 1.328v21.094c0 1.469 1.5 2.031 2.672 1.328l18.328-10.594c1.078-.625 1.078-2.187 0-2.813z"
                  fill="#fff"
                />
              </svg>
            </div>
            <div v-if="this.displayedPost.content_type === 2" class="sound-button">
              <!-- <button v-if="muted" @click="changeMuteState">unmute</button> -->
              <!-- <MuteImage v-if="muted" /> -->
              <img v-if="muted" :src="MutedImage" width="50" @click="changeMuteState" />
              <img
                v-else-if="!muted"
                :src="UnmutedImage"
                width="50"
                @click="changeMuteState"
              />
            </div>
            <div class="right-side-modal">
              <div>
                <div class="top-row-modal">
                  <img
                    :src="this.displayedPost?.user?.profile_picture"
                    class="modal-profile-picture"
                  />
                  {{ console.log("this.displayedPost", this.displayedPost) }}
                  <div class="modal-user-name">
                    <b>{{ this.displayedPost?.user?.username }}</b>
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
                          <b>{{ this.displayedPost?.user?.username }}</b>
                        </div>
                        <div class="caption">{{ this.displayedPost.caption }}</div>
                      </div>
                      <div>
                        {{ timeSinceCommentWasPosted(this.displayedPost.timestamp) }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="comments-modal">
                  <div
                    v-for="comment in this.displayedPost?.comments"
                    :key="comment.id"
                    class="comment-modal"
                  >
                    <img
                      :src="comment.user.profile_picture"
                      class="modal-profile-picture"
                    />
                    <div class="modal-comment-content">
                      <div>
                        <span @click="getProfile(comment.user.username)"
                          ><b>{{ comment.user.username }}</b></span
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
                  Liked by
                  <span @click="getProfile(this.displayedPost.likes[0].user.username)"
                    ><b>{{ this.displayedPost.likes[0].user.username }}</b></span
                  >
                  <span v-if="this.displayedPost.likes.length > 1">
                    and <b @click="displayLikesModal">others</b></span
                  >
                </div>
                <text-field
                  class="text-field"
                  :value="textFieldInput"
                  @update:value="textFieldInput = $event"
                  :addCommentToPost="addCommentToPost"
                />
              </div>
            </div>
          </div>
        </dialog>
      </div>
      <div class="private-account-message" v-else>
        This account is private. Follow to see their photos and videos.
      </div>
    </div>
  </div>
</template>

<script>
import LikeButton from "../components/LikeButton.vue";
import CommentButton from "../components/CommentButton.vue";
import EllipsisButton from "../components/EllipsisButton.vue";
import TextField from "../components/TextField.vue";
import FollowModal from "../components/FollowModal.vue";
import MutedImage from "../assets/muted.png";
import UnmutedImage from "../assets/unmuted.png";
import LeftArrow from "../assets/left-arrow.png";
import RightArrow from "../assets/right-arrow.png";
import NavBar from "../components/NavBar.vue";

import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      showFollowersModal: false,
      showFollowingModal: false,
      followingListIDs: [],
      displayedPost: {},
      isLiked: false,
      userHasStories: false,
      textFieldInput: "",
      isVideoPlaying: false,
      videoPlayer: null,
      muted: true,
      MutedImage: MutedImage,
      UnmutedImage: UnmutedImage,
      LeftArrow: LeftArrow,
      RightArrow: RightArrow,
      postModalDisplayed: false,
      currentIndex: 0,
    };
  },
  components: {
    LikeButton,
    CommentButton,
    EllipsisButton,
    TextField,
    FollowModal,
    NavBar,
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
    displayPostModal(post, index) {
      this.currentIndex = index;
      this.$refs.postModal.showModal();
      this.postModalDisplayed = true;
      this.displayedPost = post;
      this.isLiked = this.verifyUserLikedPost();

      this.$nextTick(() => {
        this.videoPlayer = this.$refs.videoPlayer;
        this.videoPlayer.addEventListener("ended", () => {
          this.videoPlayer.currentTime = 0;
          this.videoPlayer.play();
        });

        this.videoPlayer.addEventListener("click", () => {
          if (this.isVideoPlaying) {
            this.videoPlayer.pause();
          } else {
            this.videoPlayer.play();
          }
        });
      });
    },
    closePostModal() {
      this.$refs.postModal.close();
      this.postModalDisplayed = false;
      this.muted = true;
      this.$store.dispatch("getFollowingList");
      this.$store.dispatch("getProfileData");
    },
    displayLikesModal(post) {
      this.$refs.likesModal.showModal();
    },
    closeLikesModal() {
      this.$refs.likesModal.close();
    },
    follow(targetID, followerID) {
      this.console.log("targetID", targetID, "followerID", followerID);
      axios
        .post("http://localhost:7002/follow", {
          target_id: targetID,
          follower_id: followerID,
        })
        .then(() => {
          this.console.log("SRSLY");
          this.$store.dispatch("getFollowingList", this.targetUser.username).then(() => {
            this.console.log(
              "WHAT THE HAAAAL",
              this.$store.state.followList.following.map((item) => item.target_id)
            );
            this.followingListIDs = this.$store.state.followList.following.map(
              (item) => item.target_id
            );
          });
        });
    },
    unfollow(targetID, followerID) {
      console.log("target_id", targetID, "followerID", followerID);
      axios
        .post("http://localhost:7002/unfollow", {
          target_id: targetID,
          follower_id: followerID,
        })
        .then(() => {
          this.console.log("SRSLY");
          this.$store.dispatch("getFollowingList", this.targetUser.username).then(() => {
            this.console.log(
              "WHAT THE HAAAAL",
              this.$store.state.followList.following.map((item) => item.target_id)
            );
            this.followingListIDs = this.$store.state.followList.following.map(
              (item) => item.target_id
            );
          });
        });
    },
    timeSinceCommentWasPosted(time) {
      // Create a new date object from the timestamp in GMT
      const gmtDate = new Date(time);

      // Get the timezone offset for the PST timezone
      const pstOffset = -7 * 60; // PST is 8 hours behind GMT

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
        (object) => object.user.id === this.$store.state.currentUser.id
      );
      if (!userLikedPost) {
        this.isLiked = true;
        axios
          .post("http://localhost:7002/likePost", {
            target_id: this.displayedPost.id,
            user_id: this.$store.state.currentUser.id,
          })
          .then(() => {
            this.console.log("LIKED BABY");
            this.$store.dispatch("getProfileData", this.targetUser.username);
            axios
              .get(`http://localhost:7002/post/${this.displayedPost.id}`)
              .then((res) => {
                this.console.log("WTFFF", res.data.post.rows[0]);
                this.displayedPost = res.data.post.rows[0];
              });
          });
      } else {
        this.isLiked = false;
        axios
          .post("http://localhost:7002/removeLikePost", {
            target_id: this.displayedPost.id,
            user_id: this.$store.state.currentUser.id,
          })
          .then(() => {
            this.$store.dispatch("getData");
            axios
              .get(`http://localhost:7002/post/${this.displayedPost.id}`)
              .then((res) => {
                this.console.log("res.data.post.rows[0]", res.data.post.rows[0]);
                this.displayedPost = res.data.post.rows[0];
              });
          });
      }
    },
    verifyUserLikedPost() {
      this.console.log("this.$store.state.currentUser", this.$store.state.currentUser);
      this.console.log(
        "466",
        this.displayedPost.likes?.some(
          (object) => object.user.id === this.$store.state.currentUser.id
        )
      );
      if (
        this.displayedPost.likes?.some(
          (object) => object.user.id === this.$store.state.currentUser.id
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    goToProfileStories() {
      if (this.$store.state.stories.length > 0) {
        this.$router.push({
          name: "profile-stories",
          params: { userID: this.$store.state.targetUser.id },
        });
      }
    },
    getProfile(username) {
      // this.$store.dispatch("getFollowingList", username);
      this.$refs.postModal.close();
      this.$refs.likesModal.close();
      this.postModalDisplayed = false;
      this.displayedPost = {};
      this.$store.dispatch("getProfileData", username).then(() => {
        this.$nextTick(() => {
          this.$router.push({ name: "profile", params: { username } });
        });
      });
    },
    updatePost() {
      this.displayedPost = this.$store.state.userPosts.find(
        (post) => post.id === this.displayedPost.id
      );
    },
    addCommentToPost(e) {
      e.preventDefault();
      axios
        .post("http://localhost:7002/addCommentPost", {
          content: this.textFieldInput,
          user_id: this.$store.state.currentUser.id,
          post_id: this.displayedPost.id,
        })
        .then(() => {
          this.textFieldInput = "";
          this.$store.dispatch("getProfileData", this.$route.params.username).then(() => {
            this.updatePost();
          });
        });
    },
    onPlay() {
      this.isVideoPlaying = true;
    },
    onPause() {
      this.isVideoPlaying = false;
    },
    onOverlayClick() {
      this.isVideoPlaying = true;
      this.$refs.videoPlayer.play();
    },
    changeMuteState() {
      this.muted = !this.muted;
    },
    displayLeftArrow() {
      if (this.currentIndex === 0) {
        return false;
      } else {
        return true;
      }
    },
    displayRightArrow() {
      if (this.currentIndex >= this.$store.state.userPosts.length - 1) {
        return false;
      } else {
        return true;
      }
    },
    displayPreviousPost() {
      this.displayedPost = this.$store.state.userPosts[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
      this.isLiked = this.verifyUserLikedPost();
      if (this.displayedPost.content_type === 2) {
        this.$nextTick(() => {
          this.videoPlayer = this.$refs.videoPlayer;
          this.videoPlayer.addEventListener("ended", () => {
            this.videoPlayer.currentTime = 0;
            this.videoPlayer.play();
          });

          this.videoPlayer.addEventListener("click", () => {
            if (this.isVideoPlaying) {
              this.videoPlayer.pause();
            } else {
              this.videoPlayer.play();
            }
          });
        });
      }
    },
    displayNextPost() {
      this.displayedPost = this.$store.state.userPosts[this.currentIndex + 1];
      this.currentIndex = this.currentIndex + 1;
      this.isLiked = this.verifyUserLikedPost();
      if (this.displayedPost.content_type === 2) {
        this.$nextTick(() => {
          this.videoPlayer = this.$refs.videoPlayer;
          this.videoPlayer.addEventListener("ended", () => {
            this.videoPlayer.currentTime = 0;
            this.videoPlayer.play();
          });

          this.videoPlayer.addEventListener("click", () => {
            if (this.isVideoPlaying) {
              this.videoPlayer.pause();
            } else {
              this.videoPlayer.play();
            }
          });
        });
      }
    },
  },
  watch: {
    $route(to, from) {
      this.$store.dispatch("getProfileData", this.$route.params.username);
      this.$store.dispatch("getFollowingList", this.$route.params.username);
      if (this.$store.state.stories.length > 0) {
        this.userHasStories = true;
      }
    },
  },
  mounted() {
    this.$store.dispatch("updateToken").then(() => {
      this.$store.dispatch("getData").then(() => {
        this.$store.dispatch("getProfileData", this.$route.params.username);
        this.$store.dispatch("getFollowingList", this.$route.params.username).then(() => {
          this.followingListIDs = this.$store.state.followList.following.map(
            (item) => item.target_id
          );
        });
      });
    }); //1
    if (this.$store.state.stories.length > 0) {
      this.userHasStories = true;
    }
  },
  computed: {
    console: () => console,
    window: () => window,
    currentUser: function () {
      return this.$store.state.currentUser;
    },
    targetUser: function () {
      return this.$store.state.targetUser;
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
    isFollowing() {
      this.console.log("line 690", this.$store.state.currentUser);
      return this.$store.state.followList.following.includes(this.targetUser.id);
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
}

.nav-bar {
  width: 15%;
  height: 100vh;
  border-right: 1px solid;
  position: relative;
  margin-left: 20px;
}

.profile-section {
  width: 80%;
  margin-top: 30px;
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
  margin-right: 50px;
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
}

.image {
  width: 300px;
  height: 300px;
  position: relative;
  display: inline-block;
}

.video {
  width: 300px;
  height: 300px;
  object-fit: cover;
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
  width: 300px;
  height: 300px;
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
  z-index: -1000;
  position: relative;
  /* display: flex; */
}

.like-row {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.modal-likes {
  width: 350px;
  height: 400px;
  border-radius: 10px;
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

.comments-modal {
  max-height: 330px;
  max-width: 600px;
  overflow-y: scroll;
}

.comments-modal::-webkit-scrollbar {
  display: none;
}

.comment-modal {
  display: flex;
  flex-direction: row;
  margin-left: 15px;
  margin-bottom: 15px;
  width: 600px;
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

.text-field {
  margin-top: 20px;
}

.play-overlay {
  position: absolute;
  top: 8%;
  left: -5%;
  bottom: 5%;
  right: 58%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* transform: translate(-50%, -50%); */
}

.sound-button {
  position: absolute;
  top: 87%;
  left: 25%;
  width: 50px;
  height: 20px;
}

.play-button {
  width: 50px;
  height: 50px;
  fill: #fff;
}

.video-container {
  position: relative;
  display: flex;
  justify-content: center;
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
  z-index: 1000;
}

.dialog-arrows-first-post {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  pointer-events: none;
  z-index: 1000;
}

.previous-post,
.next-post {
  width: 40px;
  height: 40px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  pointer-events: auto;
}

.private-account-message {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 1100px) {
  .modal-post {
    width: 800px;
  }

  .nav-bar {
    display: none;
  }
}

@media (max-width: 1250px) {
  .nav-bar {
    display: none;
  }

  .profile-section {
    width: 100vw;
  }
}
</style>
