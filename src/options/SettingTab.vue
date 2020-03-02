<template>
	<div>
		<b-tab title="Settings" title-link-class="text-light" title-item-class="outline-info" >
			<b-container>
				<b-row>
					<b-col>
						<b-form-group label="Currency:" class="text-light">
							<b-form-select
								v-model="currencyStock"
								:options="currencies"
								@change="saveCurrencyStock"
							></b-form-select>
						</b-form-group>
					</b-col>
				</b-row>
				<hr class="bg-light"/>
				<b-row>
					<b-col sm="4">
						<b-form-file
							accept=".json"
							v-model="settingFile"
							placeholder="Choose a file or drop it here..."
							drop-placeholder="Drop file here..."
						></b-form-file>
					</b-col>
					<b-col sm="4">
						<b-button
							variant="outline-info"
							@click="updateSettings"
							:disabled="!settingFile"
						>Import settings (Stocks and Cryptos)</b-button>
					</b-col>
					<b-col sm="4">
						<b-button variant="outline-info" @click="saveSettings">Export settings (Stocks and Cryptos)</b-button>
					</b-col>
				</b-row>
			</b-container>
		</b-tab>
	</div>
</template>

<script>
import StorageST from "../js/storage-st";
import { EventBus } from "./event-bus.js";
export default {
	name: "SettingTab",
	data() {
		return {
			settingFile: null,
			currencies: [],
			currencyStock: localStorage.getItem("currencyStock")
		};
	},
	async created() {
		const res = await this._getCurrencies();
		this.currencies = [...new Set(res)].sort();
	},
	methods: {
		async _getCurrencies() {
			const currencies = ["USD"];

			const result = await fetch(
				"https://api.exchangerate-api.com/v4/latest/USD"
			).then(res => res.json());

			if (result) {
				for (const key in result.rates) {
					currencies.push(key);
				}
			}
			return currencies;
		},
		saveCurrencyStock() {
			localStorage.setItem("currencyStock", this.currencyStock);
		},
		async saveSettings() {
			const stocks = await StorageST.getValue(StorageST.STOCKS_ST);
			const cryptos = await StorageST.getValue(StorageST.CRYPTOS_ST);
			const settingFile = {
				stocks: (stocks && JSON.parse(stocks)) || [],
				cryptos: (cryptos && JSON.parse(cryptos)) || []
			};
			const element = document.createElement("a");
			element.setAttribute(
				"href",
				`data:text/plain;charset=utf-8,${encodeURIComponent(
					JSON.stringify(settingFile)
				)}`
			);
			element.setAttribute("download", "st-settings.json");
			element.style.display = "none";
			document.body.appendChild(element);
			element.click();
			document.body.removeChild(element);
		},
		updateSettings() {
			const reader = new FileReader();
			reader.onload = async event => {
				let imported = false;
				const result = JSON.parse(event.target.result);
				if (Array.isArray(result.stocks)) {
					if (result.stocks.filter(s => s.isEnabled).length <= 10) {
						await StorageST.addValue(
							StorageST.STOCKS_ST,
							JSON.stringify(result.stocks)
						);
						EventBus.$emit("update-stocks-table", result.stocks);
						imported = true;
					} else {
						this.showAlert(
							"It is possible to have a maximum of 10 stocks enabled in the list."
						);
					}
				}

				if (Array.isArray(result.cryptos)) {
					await StorageST.addValue(
						StorageST.CRYPTOS_ST,
						JSON.stringify(result.cryptos)
					);
					EventBus.$emit("update-cryptos-table", result.cryptos);
					imported = true;
				}

				imported &&
					this.showAlert(
						"Settings imported successfully.",
						"success"
					);
				this.settingFile = null;
			};
			reader.readAsText(this.settingFile);
		},
		showAlert(msg, variant = "danger") {
			this.$bvToast.toast(msg, {
				variant,
				solid: true,
				toaster: "b-toaster-top-center",
				title: chrome.i18n.getMessage("name_extension")
			});
		}
	}
};
</script>
<style lang="scss">
.vl {
	border-left: 1px solid #17a2b8;
	height: 40px;
}
</style>