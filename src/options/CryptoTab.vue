<template>
	<div>
		<b-modal ref="modalConfirmDelete" hide-footer title="Delete Stock">
			<div class="container">
				<div class="row">
					<p>Are you sure you want to delete this item?</p>
					<div class="col-md-6 pl-0">
						<a
							href="#"
							v-on:click="deleteItem(cryptoToDelete)"
							class="btn btn-danger btn-sm btn-block"
						>Confirm</a>
					</div>
					<div class="col-md-6 pr-0">
						<a
							href="#"
							v-on:click="onCloseModalDelete()"
							class="btn btn-secondary btn-sm btn-block"
						>Cancel</a>
					</div>
				</div>
			</div>
		</b-modal>
		<b-tab title="Cryptos" active>
			<b-container>
				<b-row>
					<b-form-select
						v-model="selectedCrypto"
						:options="exchanges"
						@change="onSelectCrypto(selectedCrypto)"
					></b-form-select>
				</b-row>
				<b-row>
					<b-table
						:busy="isBusy"
						ref="table"
						show-empty
						striped
						hover
						responsive
						:items="cryptos"
						:fields="fields"
						:filter="filter"
						:sort-by.sync="sortBy"
						:sort-desc.sync="sortDesc"
					>
						<template slot="exchange" slot-scope="data">{{ data.item.exchange }}</template>
						<template slot="currency" slot-scope="data">{{ data.item.currency }}</template>
						<template v-slot:cell(quantity)="data">
							<b-form-input
								v-model="data.item.quantity"
								@change="onChangeQuantityCrypto(data.item)"
								type="number"
								size="sm"
							/>
						</template>
						<template v-slot:cell(actions)="data">
							<a href="#" v-on:click="onDelete(data.item)" class="h4">
								<b-icon icon="trash" variant="danger"></b-icon>
							</a>
						</template>
						<template v-slot:table-busy>
							<div class="text-center text-dark my-2">
								<b-spinner class="align-middle"></b-spinner>
								<strong>Loading...</strong>
							</div>
						</template>
					</b-table>
				</b-row>
			</b-container>
		</b-tab>
	</div>
</template>
<script>
export default {
	name: "CryptoTab",
	data() {
		return {
			selectedCrypto: null,
			sortBy: "currency",
			sortDesc: false,
			cryptos: [],
			isBusy: false,
			filter: null,
			cryptoToDelete: null,
			fields: [
				{
					key: "exchange",
					sortable: true
				},
				{
					key: "currency",
					sortable: true
				},
				{
					key: "quantity",
					tdClass: "col-quantity-crypto"
				},
				{
					key: "actions",
                    label: "",
					tdClass: "text-right"
				}
			],
			exchanges: [
				{ value: null, text: "Please select an Exchange/Currency" },
				{
					value: { exchange: "Bitcambio", currency: "BRLXBTC" },
					text: "Bitcambio - BRL/BTC"
				},
				{
					value: { exchange: "BrasilBitcoin", currency: "BRLXBTC" },
					text: "BrasilBitcoin - BRL/BTC"
				},
				{
					value: { exchange: "Braziliex", currency: "BRLXBTC" },
					text: "Braziliex - BRL/BTC"
				},
				{
					value: { exchange: "CryptoMkt", currency: "BRLXBTC" },
					text: "CryptoMkt - BRL/BTC"
				},
				{
					value: { exchange: "FlowBtc", currency: "BRLXBTC" },
					text: "FlowBtc - BRL/BTC"
				},
				{
					value: { exchange: "Foxbit", currency: "BRLXBTC" },
					text: "Foxbit - BRL/BTC"
				},
				{
					value: { exchange: "Foxbit", currency: "BRLXETH" },
					text: "Foxbit - BRL/ETH"
				},
				{
					value: { exchange: "Foxbit", currency: "BRLXLTC" },
					text: "Foxbit - BRL/LTC"
				},
				{
					value: { exchange: "Foxbit", currency: "BRLXXRP" },
					text: "Foxbit - BRL/XRP"
				},
				{
					value: { exchange: "MercadoBitcoin", currency: "BRLXBTC" },
					text: "MercadoBitcoin - BRL/BTC"
				},
				{
					value: { exchange: "OmniTradec", currency: "BRLXBTC" },
					text: "OmniTradec - BRL/BTC"
				},
				{
					value: { exchange: "PagCripto", currency: "BRLXBTC" },
					text: "PagCripto - BRL/BTC"
				},
				{
					value: { exchange: "Profitfy", currency: "BRLXBTC" },
					text: "Profitfy - BRL/BTC"
				},
				{
					value: { exchange: "Walltime", currency: "BRLXBTC" },
					text: "Walltime - BRL/BTC"
				}
			]
		};
	},
	methods: {
		toggleBusy() {
			this.isBusy = !this.isBusy;
		},
		onDelete: function(cryptoToDelete) {
			this.toggleBusy();
			this.cryptoToDelete = cryptoToDelete;
			this.$refs.modalConfirmDelete.show();
		},
		deleteItem: function(cryptoToDelete) {
			const doDelete = arr => {
				const indexCrypto = arr.findIndex(
					s =>
						s.exchange === cryptoToDelete.exchange &&
						s.currency === cryptoToDelete.currency
				);
				if (indexCrypto > -1) {
					arr.splice(indexCrypto, 1)[0];
					localStorage.setItem("cryptosST", JSON.stringify(arr));
				}
			};
			const cryptos = JSON.parse(localStorage.getItem("cryptosST"));
			doDelete(cryptos);
			doDelete(this.cryptos);
			this.onCloseModalDelete();
		},
		onCloseModalDelete: function() {
			this.$refs.modalConfirmDelete.hide();
			this.toggleBusy();
			this.$refs.table.refresh();
		},
		onSelectCrypto: function(selectedCrypto) {
			const cryptos = JSON.parse(localStorage.getItem("cryptosST"));
			const indexCrypto = cryptos.findIndex(
				c =>
					c.exchange === selectedCrypto.exchange &&
					c.currency === selectedCrypto.currency
			);
			if (indexCrypto === -1) {
				selectedCrypto.quantity = Number(0);
				cryptos.push(selectedCrypto);
				localStorage.setItem("cryptosST", JSON.stringify(cryptos));
				this.cryptos = cryptos;
				this.selectedCrypto = null;
			}
		},
		onChangeQuantityCrypto: function(selectedCrypto) {
			const cryptos = JSON.parse(localStorage.getItem("cryptosST"));
			const indexCrypto = cryptos.findIndex(
				c =>
					c.exchange === selectedCrypto.exchange &&
					c.currency === selectedCrypto.currency
			);
			if (indexCrypto > -1) {
				const cryptoDeleted = cryptos.splice(indexCrypto, 1)[0];
				cryptoDeleted.quantity = Number(selectedCrypto.quantity);
				cryptos.push(cryptoDeleted);
				localStorage.setItem("cryptosST", JSON.stringify(cryptos));
			}
		},
		showAlert(msg, variant = "danger") {
			this.$bvToast.toast(msg, {
				variant,
				solid: true,
				toaster: "b-toaster-top-center",
				title: chrome.i18n.getMessage("name_extension")
			});
		}
	},
	mounted() {
		if (localStorage.cryptosST) {
			this.cryptos = JSON.parse(localStorage.getItem("cryptosST"));
		}
	}
};
</script>
<style lang="scss">
.col-quantity-crypto {
	width: 90px;
}
</style>