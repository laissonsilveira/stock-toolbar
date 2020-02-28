<template>
	<b-container>
		<b-tabs small fill nav-class="bg-dark" active-nav-item-class="font-weight-bold bg-info">
			<!-- <stock-tab @openOptionsPage="openOptionsPage"></stock-tab> -->
			<crypto-tab @openOptionsPage="openOptionsPage"></crypto-tab>
		</b-tabs>
	</b-container>
</template>

<script>
// import StockTab from "./StockTab";
import CryptoTab from "./CryptoTab";
export default {
	components: {
		// StockTab,
		CryptoTab
	},
	methods: {
		openOptionsPage() {
			chrome.runtime.openOptionsPage();
		}
	},
	async created() {
		const URL = "https://api.exchangerate-api.com/v4/latest/";
		localStorage.setItem(
			"exchanges",
			JSON.stringify(
				await fetch(
					`${URL}${localStorage.getItem("currencyStock")}`
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
