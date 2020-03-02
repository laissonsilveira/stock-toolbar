<template>
	<div>
		<b-container>
			<b-card no-body bg-variant="dark">
				<b-tabs content-class="mt-3" card nav-class="bg-dark" active-nav-item-class="font-weight-bold bg-info">
					<stock-tab></stock-tab>
					<crypto-tab></crypto-tab>
					<setting-tab></setting-tab>
				</b-tabs>
			</b-card>
		</b-container>
	</div>
</template>

<script>
import StockTab from "./StockTab";
import CryptoTab from "./CryptoTab";
import SettingTab from "./SettingTab";
export default {
	name: "App",
	components: {
		StockTab,
		CryptoTab,
		SettingTab
	},
	data() {
		return {
			config: null
		};
	}
};
</script>
<style lang="scss">
body {
	padding-top: 50px;
	background-color: #6c757d;
}
.page-item.active .page-link {
	background-color: gray;
	border-color: gray;
}
.actions {
	min-width: 110px;
}
</style>
