import Vue from "vue";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import App from "./Popup.vue";

global.browser = require("webextension-polyfill");
Vue.prototype.$browser = global.browser;

function _exchangeCurrency(val, currency, isTotal) {
	if (!currency) return val;
	const exchanges = JSON.parse(localStorage.getItem("exchanges"));
	if (isTotal) return val / exchanges.rates[currency];
	return Number(val / exchanges.rates[currency]).toFixed(2);
}

Vue.filter('exchangeCurrency', _exchangeCurrency);

Vue.filter('toCurrency', function (value, currency, locale = navigator.languages) {
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
		currency: localStorage.getItem("currencyStock"),
		minimumFractionDigits: 0
	});
	return formatter.format(_exchangeCurrency(value, currency));
});

/* eslint-disable no-new */
new Vue({
	el: "#app",
	render: h => h(App)
});
