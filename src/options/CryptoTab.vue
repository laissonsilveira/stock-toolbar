<template>
	<div>
		<b-tab title="Cryptos" active>
			<b-container>
				<b-row>
					<b-form-select v-model="exchangeSelected" :options="exchanges"></b-form-select>
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
							<a href="#" v-on:click="getID(data.item.exchange, data.item.currency)" class="h4">
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
			exchangeSelected: null,
			sortBy: "currency",
			sortDesc: false,
			cryptos: [],
			isBusy: false,
			filter: null,
			selectedID: null,
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
					tdClass: "col-quantity"
				},
				{
					key: "actions",
					tdClass: "col-actions"
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
			],
			methods: {
				toggleBusy() {
					this.isBusy = !this.isBusy;
				},
				getID: function(exchange, currency) {
					// this.toggleBusy();
					// this.selectedID = id;
					// this.$refs.modalConfirmDelete.show();
				},
				deleteItem: function(symbol) {
					// const doDelete = arr => {
					// 	const indexStock = arr.findIndex(
					// 		s => s["1. symbol"] === symbol
					// 	);
					// 	if (indexStock > -1) {
					// 		arr.splice(indexStock, 1)[0];
					// 		localStorage.setItem(
					// 			"stocksST",
					// 			JSON.stringify(arr)
					// 		);
					// 	}
					// };
					// const stocks = JSON.parse(localStorage.getItem("stocksST"));
					// doDelete(stocks);
					// doDelete(this.stocks);
					// localStorage.removeItem(symbol);
					// this.onCloseModalDelete();
				},
				onCloseModalDelete: function() {
					// this.$refs.modalConfirmDelete.hide();
					// this.toggleBusy();
					// this.$refs.table.refresh();
				},
				onChangeQuantityCrypto: function(stockItem) {
					// const symbol = stockItem["1. symbol"];
					// const stocks = JSON.parse(localStorage.getItem("stocksST"));
					// const indexStock = stocks.findIndex(
					// 	s => s["1. symbol"] === symbol
					// );
					// if (indexStock > -1) {
					// 	const stockDeleted = stocks.splice(indexStock, 1)[0];
					// 	stockDeleted.quantity = Number(stockItem.quantity);
					// 	stocks.push(stockDeleted);
					// 	localStorage.setItem(
					// 		"stocksST",
					// 		JSON.stringify(stocks)
					// 	);
					// }
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
				// if (localStorage.stocksST) {
				// 	this.stocks = JSON.parse(localStorage.getItem("stocksST"));
				// 	this.totalRows = this.stocks.length;
				// }
			}
		};
	}
};
</script>