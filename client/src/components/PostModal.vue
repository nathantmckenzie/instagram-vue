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
          {{
            title === "Followers"
              ? follower.follower_name
              : title === "Following"
              ? follower.target_name
              : null
          }}
        </div>
        <button @click="unfollow(follower.id, 1)" class="follow-button">
          {{
            title === "Followers"
              ? followingListIDs.includes(follower.id)
                ? "Following"
                : "Follow"
              : title === "Following"
              ? followingListIDs.includes(follower.id)
                ? "Following"
                : "Follow"
              : null
          }}
        </button>
      </li>
    </ul>
  </dialog>
</template>

<script>
export default {
  name: "FollowModalComponent",
  data() {
    return {
      followingListIDs: [],
      followersListIDs: [],
    };
  },
  props: {
    list: Array,
    title: String,
  },
  methods: {
    closeModal() {
      this.$refs.modalContainer.close();
    },
  },
  computed: {
    console: () => console,
  },
  mounted() {
    this.followersListIDs = this.$store.state.followList.following.map(
      (item) => item.follower_id
    );

    this.followingListIDs = this.$store.state.followList.following.map(
      (item) => item.target_id
    );
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
