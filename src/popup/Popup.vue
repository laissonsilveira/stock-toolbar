<template>
	<b-container>
		<b-tabs small fill nav-class="bg-dark" active-nav-item-class="font-weight-bold bg-info">
			<stock-tab></stock-tab>
			<crypto-tab></crypto-tab>
		</b-tabs>
	</b-container>
</template>

<script>
import StockTab from "./StockTab";
import CryptoTab from "./CryptoTab";
export default {
	components: {
		StockTab,
		CryptoTab
	},
	methods: {
		toggleBusy() {
			this.isBusy = !this.isBusy;
		},
		getBadgeColor(percent) {
			if (percent === "0.00") {
				return "primary";
			} else if (percent && percent.includes("-")) {
				return "danger";
			} else {
				return "success";
			}
		},
		openOptionsPage() {
			chrome.runtime.openOptionsPage();
		},
		exchangeCurrency(value, currency) {
			return value * JSON.parse(localStorage.getItem("exchanges")).rates[currency];
		},
		getOwn(quantity, price, currency) {
			return Number(
				quantity * this.exchangeCurrency(price, currency)
			).toFixed(2);
		}
	},
	async created() {
		localStorage.setItem(
			"exchanges",
			JSON.stringify(
				await fetch(
					`https://api.exchangerate-api.com/v4/latest/${localStorage.getItem(
						"currencyStock"
					)}`
				).then(res => res.json())
			)
		);
	}
};
</script>
<style lang="scss">
@font-face {
	font-family: "Wallstreet";
	src: url("/fonts/wallstreet.eot");
	src: url("/fonts/wallstreet.ttf") format("truetype");
	font-weight: normal;
	font-style: normal;
}
.symbol {
	font-family: "Wallstreet";
}
body {
	padding: 0;
	margin: 0;
	width: 400px;
	background-color: #1d2124;
}
.container {
	margin: 0;
	padding: 0;
}
.hidden_header {
	display: none;
}
.price-detail {
	font-size: 11.5px;
}
</style>
