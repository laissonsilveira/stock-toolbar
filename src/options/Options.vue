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
	min-width: 110px;
}
</style>