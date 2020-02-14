<template>
	<div>
		<b-container>
			<b-card no-body>
				<b-tabs content-class="mt-3" card>
					<stock-tab></stock-tab>
					<crypto-tab></crypto-tab>
					<template v-slot:tabs-end>
						<b-button variant="outline-info" size="sm" @click="saveConfigs">Salvar configurações</b-button>
						<b-form-file accept=".json" v-model="config"></b-form-file>
						<b-button variant="outline-info" size="sm" @click="updateConfigs">Atualizar configurações</b-button>
					</template>
				</b-tabs>
			</b-card>
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
	data() {
		return {
			config: null
		};
	},
	methods: {
		saveConfigs() {
			const config = {
				stocks:
					(localStorage.stocksST &&
						JSON.parse(localStorage.getItem("stocksST"))) ||
					[],
				cryptos:
					(localStorage.cryptosST &&
						JSON.parse(localStorage.getItem("cryptosST"))) ||
					[]
			};
			const element = document.createElement("a");
			element.setAttribute(
				"href",
				`data:text/plain;charset=utf-8,${encodeURIComponent(
					JSON.stringify(config)
				)}`
			);
			element.setAttribute("download", "configs.json");
			element.style.display = "none";
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		updateConfigs() {
			alert(this.config);
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
	min-width: 110px;
}
</style>