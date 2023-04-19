import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./global.css";
import lazyload from "vue3-lazyload";

createApp(App).use(store).use(lazyload).use(router).mount("#app");
