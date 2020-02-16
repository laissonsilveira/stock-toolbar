import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import ToggleButton from "vue-js-toggle-button";
Vue.use(ToggleButton);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "@trevoreyre/autocomplete-vue/dist/style.css";
import App from "./Options.vue";

global.browser = require("webextension-polyfill");

/* eslint-disable no-new */
new Vue({
  el: "#app",
  render: h => h(App)
});
