<template>
  <div>
    <div class="input-column">
      <input
        :value="loginValue"
        @input="loginValue = $event.target.value"
        placeholder="Email"
      />
      <input
        :value="passwordValue"
        @input="passwordValue = $event.target.value"
        placeholder="Password"
        type="password"
      />
    </div>
    <button @click="login">Login</button>
    <button @click="logout">Logout</button>
    <div>Don't have an account? <span @click="goToSignUpPage">Sign up</span></div>
  </div>
</template>

<script>
import {
  getAuth,
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
      loginValue: "",
      passwordValue: "",
    };
  },
  methods: {
    async login() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.loginValue, this.passwordValue).then(
        (userCredential) => {
          this.user.value = userCredential;
          this.$router.push({ name: "home" });
        }
      );
    },
    async logout() {
      try {
        const auth = getAuth();
        await signOut(auth);
      } catch (err) {
        console.error(err);
      }
    },
    goToSignUpPage() {
      this.$router.push({ name: "signup" });
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
