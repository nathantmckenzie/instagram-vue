<template>
  <div class="chat-container">
    <div class="chat-list">
      <h2>Direct Messages</h2>
      <div>
        <div
          v-for="conversation of this.$store.state.conversations"
          :key="conversation.conversation_id"
          @click="this.selectThread(conversation.conversation_id)"
          class="avatar-info-row"
        >
          <img
            :src="conversation.user2.profile_picture"
            class="chat-list-avatar"
            alt="Avatar"
          />
          <div class="chat-list-info">
            <div>{{ conversation.user2.username }}</div>
            <div class="last-message-time-ago-row">
              <p class="last-message">
                {{ conversation.direct_messages.at(-1).text }}
              </p>
              <span class="chat-list-time">{{
                timeSinceCommentWasPosted(conversation.direct_messages.at(-1).time_sent)
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedThread" class="chat-messages">
      <div class="chat-messages-header">
        <img
          :src="this.selectedThread.user2.profile_picture"
          class="chat-messages-avatar"
          alt="Avatar"
        />
        <div class="chat-messages-info">
          <div>{{ selectedThread.user }}</div>
          <span class="chat-messages-status">{{ selectedThread.status }}</span>
        </div>
      </div>
      <div>
        <div class="chat-messages-list" ref="messageList">
          <div
            v-for="message in selectedThread.direct_messages"
            :key="message.id"
            :class="[message.sender_id === 1 ? 'sent-message' : 'received-message']"
          >
            <!-- <span class="chat-messages-time">{{ message.time }}</span> -->
            <div :class="[message.sender_id === 1 ? 'sent-test' : 'received-test']">
              <img
                :src="[
                  message.sender_id === 1
                    ? this.selectedThread.user1.profile_picture
                    : this.selectedThread.user2.profile_picture,
                ]"
                class="chat-messages-avatar"
                alt="Avatar"
              />
              <span
                :class="['chat-message', message.sender_id === 1 ? 'sent' : 'received']"
                >{{ message.text }}</span
              >
            </div>
          </div>
          <div ref="dummyRef"></div>
        </div>
        <form class="chat-messages-form" @submit.prevent="sendMessage">
          <input
            class="chat-messages-input"
            :value="this.messageInput"
            @input="this.messageInput = $event.target.value"
            placeholder="Type your message..."
          />
          <button>Send</button>
        </form>
      </div>
    </div>
    <div v-else class="chat-messages-placeholder">
      <h2>No conversation selected</h2>
    </div>
  </div>
</template>

<script>
import timeSinceCommentWasPosted from "../helper-functions";

import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      messageInput: "",
      selectedThread: null,
      timeSinceCommentWasPosted: timeSinceCommentWasPosted,
    };
  },
  updated() {
    // this.socket = io("http://localhost:7002"); // Replace with your server's URL
    // this.socket.on("chat-message", (message) => {
    //   this.messages.push(message);
    // });
    this.$nextTick(() => {
      this.console.log("wtf", this.$refs);
      this.$refs.dummyRef.scrollIntoView();
    });
  },
  watch: {
    selectedThread() {
      this.$nextTick(() => {
        this.$refs.dummyRef.scrollIntoView();
      });
    },
  },
  methods: {
    sendMessage() {
      // this.socket.emit("chat-message", { user: "Me", text: this.newMessage });
      // this.newMessage = "";
      console.log(
        "okaay",
        this.messageThreads.filter((thread) => thread.userID === 1)
      );
      const userThreads = this.messageThreads.find((thread) => thread.userID === 1);
      userThreads.messages.push({
        id: 19043,
        text: this.messageInput,
        avatar: "https://picsum.photos/50",
        time: "12:02 AM",
        sent: false,
      });
      this.messageInput = "";
    },
    selectThread(conversationID) {
      console.log(
        this.$store.state.conversations.find(
          (conversation) => conversation.conversation_id === conversationID
        )
      );
      this.selectedThread = this.$store.state.conversations.find(
        (conversation) => conversation.conversation_id === conversationID
      );
      this.console.log("hi", this.selectedThread.user1);
      this.$nextTick(() => {
        if (this.$refs.dummyRef) {
          this.console.log(this.$refs.dummyRef);
          this.$refs.dummyRef.scrollIntoView();
        }
      });
    },
  },
  mounted() {
    this.$store.dispatch("updateToken").then(() => {
      this.$store.dispatch("getConversations", this.$route.params.userID);
    });
  },
  computed: {
    console: () => console,
  },
};
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: row;
  overflow: hidden;
}
.avatar-info-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
}

.chat-list {
  width: 450px;
}

.chat-list-avatar {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 50%;
}

.chat-list-info {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.last-message {
  margin: 0;
  margin-right: 20px;
}

.last-message-time-ago-row {
  display: flex;
  flex-direction: row;
}

.chat-messages {
  width: 86vw;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-messages-list {
  overflow-y: scroll;
  overflow-x: hidden;
  word-wrap: break-word;
  overflow-wrap: break-word;
  max-height: calc(100vh - 60px);
  margin-top: auto;
}

.chat-messages-header {
  display: flex;
  flex-direction: row;
  border-style: solid;
}

.chat-messages-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

/* .chat-message-row {
  display: flex;
  flex-direction: row;
} */

.chat-messages-time {
  display: flex;
  justify-content: center;
}

.sent-message {
  display: flex;
  justify-content: flex-end;
}

.sent-test {
  display: flex;
  flex-direction: row-reverse;
}

.received-test {
  display: flex;
}

.received-message {
  display: flex;
  justify-content: flex-start;
}

.chat-messages-form {
  position: fixed;
  bottom: 0;
  width: calc(50% - 60px);
}

.chat-messages-input {
  width: 300px;
}

.chat-message-avatar-start {
  display: flex;
  flex-direction: row-reverse;
}

.chat-message-avatar-received {
  display: flex;
  flex-direction: row;
}

.chat-message {
  border-radius: 20px;
  padding: 10px 15px;
  font-size: 16px;
  line-height: 1.4;
  max-width: 70%;
}

.sent {
  background-color: #39f;
  color: #fff;
  float: right;
}

.received {
  background-color: #eee;
  color: #444;
  float: left;
}
.sent:before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 0 16px 16px 0;
  border-color: transparent #39f transparent transparent;
  right: -8px;
  bottom: 0;
}

.received:before {
  content: "";
  position: absolute;
  border-style: solid;
  border-width: 16px 16px 0 0;
  border-color: #eee transparent transparent transparent;
  left: -8px;
  bottom: 0;
}
</style>
