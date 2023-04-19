<template>
  <dialog class="follow-modal" ref="modalContainer">
    {{ this.showFollowersModal ? this.modalUpdate : null }}
    <div class="follow-modal-top-row">
      <h3>{{ this.title }}</h3>
      <div @click="closeModal">Close Modal</div>
    </div>
    <ul>
      <li v-for="follower in this.list" :key="follower.id" class="follower-row">
        <div class="profile-picture-username">
          <img
            :src="
              title === 'Followers'
                ? follower.follower_profile_picture
                : title === 'Following'
                ? follower.target_profile_picture
                : null
            "
            class="follower-profile-picture"
          />
          <span @click="getProfile(follower)"
            >{{
              title === "Followers"
                ? follower.follower_username
                : title === "Following"
                ? follower.target_username
                : null
            }}
          </span>
        </div>
        <button
          v-if="
            title === 'Followers' &&
            followingListIDs.includes(follower.follower_id) &&
            this.$store.state.currentUser.id !== follower.follower_id
          "
          @click="unfollow(follower.follower_id, this.$store.state.currentUser.id)"
          class="following-button"
        >
          Following
        </button>
        <button
          v-else-if="
            title === 'Followers' &&
            !followingListIDs.includes(follower.follower_id) &&
            this.$store.state.currentUser.id !== follower.follower_id
          "
          @click="follow(follower.follower_id, this.$store.state.currentUser.id)"
          class="follow-button"
        >
          Follow
        </button>
        <button
          v-else-if="
            title === 'Following' && followingListIDs.includes(follower.target_id)
          "
          @click="unfollow(follower.target_id, this.$store.state.currentUser.id)"
          class="following-button"
        >
          Following
        </button>
        <button
          v-else-if="
            title === 'Following' && !followingListIDs.includes(follower.target_id)
          "
          @click="follow(follower.target_id, this.$store.state.currentUser.id)"
          class="follow-button"
        >
          Follow
        </button>
      </li>
    </ul>
  </dialog>
</template>

<script>
export default {
  name: "FollowModalComponent",
  props: {
    list: Array,
    title: String,
    getProfileFunction: Function,
    follow: Function,
    unfollow: Function,
    followingListIDs: Array,
  },
  methods: {
    closeModal() {
      this.$refs.modalContainer.close();
    },
    getProfile(follower) {
      if (this.title === "Followers") {
        console.log("this.follower_username", follower.follower_username);
        this.getProfileFunction(follower.follower_username);
      } else if (this.title === "Following") {
        this.getProfileFunction(follower.target_username);
      }
      this.closeModal();
    },
  },
  computed: {
    console: () => console,
  },
};
</script>

<style scoped>
.follow-modal-top-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;
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

.following-button {
  background-color: white;
  border-radius: 20%;
  color: black;
}

.profile-picture-username {
  display: flex;
  align-items: center;
}

.follower-profile-picture {
  width: 30px;
  height: 30px;
  border-radius: 30px;
  margin-right: 5px;
}

.follower-row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}

ul {
  margin: 0;
  padding: 0;
}
</style>
