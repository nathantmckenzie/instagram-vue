import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import ProfileView from "../views/ProfileView.vue";
import StoriesView from "../components/Stories.vue";
import LoginView from "../views/LoginView.vue";
import SignUpView from "../views/SignUpView.vue";

import { getAuth } from "firebase/auth";

const verifyUserIsLoggedIn = (next) => {
  const auth = getAuth();
  const unsubscribe = auth.onAuthStateChanged((user) => {
    unsubscribe();
    if (user) {
      next();
    } else {
      next({ path: "/login" });
    }
  });
};

const routes = [
  {
    path: "/about",
    name: "about",
    component: AboutView,
    beforeEnter: (to, from, next) => {
      verifyUserIsLoggedIn(next);
    },
  },
  {
    path: "/",
    name: "home",
    component: HomeView,
    beforeEnter: (to, from, next) => {
      verifyUserIsLoggedIn(next);
    },
  },
  {
    path: "/:username",
    name: "profile",
    component: ProfileView,
    beforeEnter: (to, from, next) => {
      verifyUserIsLoggedIn(next);
    },
  },
  {
    path: "/stories/:userID",
    name: "profile-stories",
    component: StoriesView,
    beforeEnter: (to, from, next) => {
      verifyUserIsLoggedIn(next);
    },
  },
  {
    path: "/stories",
    name: "stories",
    component: StoriesView,
    beforeEnter: (to, from, next) => {
      verifyUserIsLoggedIn(next);
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});
export default router;
