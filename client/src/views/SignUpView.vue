<template>
  <div>
    <div class="input-column">
      <input
        :value="emailValue"
        @input="emailValue = $event.target.value"
        placeholder="Email"
      />
      <input
        :value="fullNameValue"
        @input="fullNameValue = $event.target.value"
        placeholder="Full Name"
      />
      <input
        :value="usernameValue"
        @input="usernameValue = $event.target.value"
        placeholder="Username"
      />
      <input
        :value="passwordValue"
        @input="passwordValue = $event.target.value"
        placeholder="Password"
        type="password"
      />
    </div>
    <button @click="signup">Signup</button>
    <div>Have an account? <span @click="goToLoginPage">Login</span></div>
  </div>
</template>

<script>
import { ref } from "vue";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import axios from "axios";

import auth from "../../firebase";

export default {
  data() {
    return {
      user: {},
      emailValue: "",
      fullNameValue: "",
      usernameValue: "",
      passwordValue: "",
    };
  },
  methods: {
    async signup() {
      const auth = getAuth();
      createUserWithEmailAndPassword(auth, this.emailValue, this.passwordValue)
        .then((userCredential) => {
          this.user.value = userCredential;
          return userCredential.user.getIdToken();
        })
        .then((idToken) => {
          axios.post(
            "http://localhost:7002/signup",
            {
              username: this.usernameValue,
              fullName: this.fullNameValue,
            },
            { headers: { Authorization: idToken } }
          );
        })
        .catch((error) => {
          this.console.error(error);
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    },
    goToLoginPage() {
      this.$router.push({ name: "login" });
    },
  },
  mounted() {
    const auth = getAuth();
    onAuthStateChanged(auth, (newUser) => {
      this.user = newUser;
    });
  },
  computed: {
    console: () => console,
    window: () => window,
  },
};
</script>

<style scoped>
.input-column {
  display: flex;
  flex-direction: column;
}

input {
  width: 200px;
}
</style>
