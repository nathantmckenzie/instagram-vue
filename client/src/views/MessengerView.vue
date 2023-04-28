<template>
  <div class="chat-container">
    <div class="chat-list">
      <h2>Direct Messages</h2>
      <div>
        <div
          v-for="messageThread of messageThreads"
          :key="messageThread.userID"
          @click="selectThread(messageThread.userID)"
          class="avatar-info-row"
        >
          {{ console.log("MESSAGETHREAD", messageThread) }}
          <img :src="messageThread.avatar" class="chat-list-avatar" alt="Avatar" />
          <div class="chat-list-info">
            <div>{{ messageThread.user }}</div>
            <div class="last-message-time-ago-row">
              <p class="last-message">{{ messageThread.text }}</p>
              <span class="chat-list-time">{{ messageThread.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedThread" class="chat-messages">
      <div class="chat-messages-header">
        <img :src="selectedThread.avatar" class="chat-messages-avatar" alt="Avatar" />
        <div class="chat-messages-info">
          <div>{{ selectedThread.user }}</div>
          <span class="chat-messages-status">{{ selectedThread.status }}</span>
        </div>
      </div>
      <div class="chat-messages-list">
        <div
          v-for="message in selectedThread.messages"
          :key="message.id"
          class="chat-message-row"
        >
          <img :src="message.avatar" class="chat-messages-avatar" alt="Avatar" />
          <div class="chat-messages-message">
            <span>{{ message.text }}</span>
            <span class="chat-messages-time">{{ message.time }}</span>
          </div>
        </div>
      </div>
      <form class="chat-messages-form" @submit.prevent="sendMessage">
        <input v-model="newMessage" placeholder="Type your message..." />
        <button>Send</button>
      </form>
    </div>
    <div v-else class="chat-messages-placeholder">
      <h2>No conversation selected</h2>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";

export default {
  data() {
    return {
      socket: null,
      messageThreads: [
        {
          user: "John Doe",
          userID: 1,
          avatar: "https://picsum.photos/50",
          status: "Active now",
          text: "Hey, what's up?",
          time: "10:30 AM",
          messages: [
            {
              id: 1,
              text: "Hey there!",
              avatar: "https://picsum.photos/50",
              time: "10:32 AM",
              sent: false,
            },
            {
              id: 2,
              text: "Just wanted to say hi",
              avatar: "https://picsum.photos/50",
              time: "10:33 AM",
              sent: true,
            },
            {
              id: 3,
              text: "How are you?",
              avatar: "https://picsum.photos/50",
              time: "10:34 AM",
              sent: false,
            },
          ],
        },
        {
          user: "Jane Smith",
          userID: 2,
          avatar: "https://picsum.photos/51",
          status: "Active now",
          text: "Hola como estas?",
          time: "10:30 AM",
          messages: [
            {
              id: 1,
              text: "Hola!",
              avatar: "https://picsum.photos/51",
              time: "10:32 AM",
              sent: false,
            },
            {
              id: 2,
              text: "Como estas?",
              avatar: "https://picsum.photos/51",
              time: "10:33 AM",
              sent: true,
            },
            {
              id: 3,
              text: "Te amo",
              avatar: "https://picsum.photos/51",
              time: "10:34 AM",
              sent: false,
            },
          ],
        },
      ],
      newMessage: "",
      selectedThread: null,
    };
  },
  mounted() {
    // this.socket = io("http://localhost:7002"); // Replace with your server's URL
    // this.socket.on("chat-message", (message) => {
    //   this.messages.push(message);
    // });
  },
  methods: {
    sendMessage() {
      this.socket.emit("chat-message", { user: "Me", text: this.newMessage });
      this.newMessage = "";
    },
    selectThread(userID) {
      console.log(this.messageThreads.find((thread) => thread.userID === userID));
      this.selectedThread = this.messageThreads.find(
        (thread) => thread.userID === userID
      );
    },
  },
  computed: {
    console: () => console,
  },
};
</script>

<style scoped>
.chat-container {
  margin: 30px;
  display: flex;
  flex-direction: row;
  height: 95%;
}
.avatar-info-row {
  display: flex;
  flex-direction: row;
  margin-bottom: 10px;
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
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.chat-messages-header {
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;
  border-style: solid;
}

.chat-messages-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}

.chat-message-row {
  display: flex;
  flex-direction: row;
}
</style>
