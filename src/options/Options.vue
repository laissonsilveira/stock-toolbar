<template>
	<div>
		<b-container>
			<b-tabs content-class="mt-3">
				<stock-tab></stock-tab>
				<crypto-tab></crypto-tab>
			</b-tabs>
		</b-container>
	</div>
</template>

<script>
import StockTab from "./StockTab";
import CryptoTab from "./CryptoTab";
export default {
	name: "App",
	components: {
		StockTab,
		CryptoTab
	},
	methods: {
		onChangeQuantityStock: function(stockItem) {
			const symbol = stockItem["1. symbol"];
			const stocks = JSON.parse(localStorage.getItem("stocksST"));
			const indexStock = stocks.findIndex(s => s["1. symbol"] === symbol);
			if (indexStock > -1) {
				const stockDeleted = stocks.splice(indexStock, 1)[0];
				stockDeleted.quantity = Number(stockItem.quantity);
				stocks.push(stockDeleted);
				localStorage.setItem("stocksST", JSON.stringify(stocks));
			}
		}
	}
};
</script>
<style lang="scss">
body {
	padding-top: 50px;
}
.page-item.active .page-link {
	background-color: gray;
	border-color: gray;
}
.actions {
	width: 110px;
}
</style>