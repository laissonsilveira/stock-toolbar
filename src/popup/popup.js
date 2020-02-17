import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import App from "./Popup.vue";

global.browser = require("webextension-polyfill");
Vue.prototype.$browser = global.browser;

Vue.filter('toCurrency', function (
	value,
	currency = localStorage.getItem("currencyStock"),
	locale = navigator.language
) {
	try {
		value = Number(value);
		if (isNaN(value) || typeof value !== "number") {
			return value;
		}
	} catch (err) {
		console.error(err);
		return value;
	}
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency,
		minimumFractionDigits: 0
	});
	return formatter.format(value);
});

/* eslint-disable no-new */
new Vue({
	el: "#app",
	render: h => h(App)
});
