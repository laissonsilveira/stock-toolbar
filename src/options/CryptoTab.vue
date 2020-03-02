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
		<b-tab title="Cryptos" title-link-class="text-light" title-item-class="outline-info" >
			<b-container>
				<b-row class="mb-2">
					<b-form-select
						v-model="selectedCrypto"
						:options="exchanges"
						@change="onSelectCrypto(selectedCrypto)"
					></b-form-select>
				</b-row>
				<b-row>
					<b-col>
						<b-table
							:busy="isBusy"
							ref="table"
							show-empty
							striped
							hover
							responsive
							dark
							:items="cryptos"
							:fields="fields"
							:current-page="currentPage"
							:per-page="perPage"
							:sort-by.sync="sortBy"
							:sort-desc.sync="sortDesc"
						>
							<template slot="symbol" slot-scope="data">
								{{
								data.item.symbol
								}}
							</template>
							<template slot="exchange" slot-scope="data">
								{{
								data.item.exchange
								}}
							</template>
							<template slot="currency" slot-scope="data">
								{{
								data.item.currency
								}}
							</template>
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
						<b-pagination
							align="center"
							size="sm"
							pills
							:total-rows="totalRows"
							:per-page="perPage"
							v-model="currentPage"
						/>
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
	name: "CryptoTab",
	data() {
		return {
			currentPage: 1,
			perPage: 5,
			totalRows: null,
			selectedCrypto: null,
			sortBy: "symbol",
			sortDesc: false,
			cryptos: [],
			isBusy: false,
			cryptoToDelete: null,
			fields: [
				{
					key: "symbol",
					sortable: true
				},
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
					value: {
						exchange: "Bitcambio",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "bitcambio.com.br"
					},
					text: "Bitcambio - BRL/BTC"
				},
				{
					value: {
						exchange: "BrasilBitcoin",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://brasilbitcoin.com.br/"
					},
					text: "Brasil Bitcoin - BRL/BTC"
				},
				{
					value: {
						exchange: "Braziliex",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://braziliex.com/"
					},
					text: "Braziliex - BRL/BTC"
				},
				{
					value: {
						exchange: "CryptoMkt",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://www.cryptomkt.com/"
					},
					text: "CryptoMKT - BRL/BTC"
				},
				{
					value: {
						exchange: "FlowBtc",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://www.flowbtc.com.br/"
					},
					text: "FlowBtc - BRL/BTC"
				},
				{
					value: {
						exchange: "Foxbit",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://foxbit.com.br/"
					},
					text: "Foxbit - BRL/BTC"
				},
				{
					value: {
						exchange: "Foxbit",
						id: "BRLXETH",
						currency: "BRL",
						symbol: "ETH",
						url: "https://foxbit.com.br/"
					},
					text: "Foxbit - BRL/ETH"
				},
				{
					value: {
						exchange: "Foxbit",
						id: "BRLXLTC",
						currency: "BRL",
						symbol: "LTC",
						url: "https://foxbit.com.br/"
					},
					text: "Foxbit - BRL/LTC"
				},
				{
					value: {
						exchange: "Foxbit",
						id: "BRLXXRP",
						currency: "BRL",
						symbol: "XRP",
						url: "https://foxbit.com.br/"
					},
					text: "Foxbit - BRL/XRP"
				},
				{
					value: {
						exchange: "MercadoBitcoin",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://www.mercadobitcoin.com.br/"
					},
					text: "MercadoBitcoin - BRL/BTC"
				},
				{
					value: {
						exchange: "OmniTradec",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://omnitrade.io/"
					},
					text: "OmniTradec - BRL/BTC"
				},
				{
					value: {
						exchange: "PagCripto",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://www.pagcripto.com.br/"
					},
					text: "PagCripto - BRL/BTC"
				},
				{
					value: {
						exchange: "Profitfy",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://profitfy.trade/"
					},
					text: "Profitfy - BRL/BTC"
				},
				{
					value: {
						exchange: "Walltime",
						id: "BRLXBTC",
						currency: "BRL",
						symbol: "BTC",
						url: "https://walltime.info/"
					},
					text: "Walltime - BRL/BTC"
				}
			]
		};
	},
	methods: {
		toggleBusy() {
			this.isBusy = !this.isBusy;
		},
		onDelete(cryptoToDelete) {
			this.toggleBusy();
			this.cryptoToDelete = cryptoToDelete;
			this.$refs.modalConfirmDelete.show();
		},
		async deleteItem(cryptoToDelete) {
			const doDelete = async arr => {
				const indexCrypto = arr.findIndex(
					s =>
						s.exchange === cryptoToDelete.exchange &&
						s.id === cryptoToDelete.id
				);
				if (indexCrypto > -1) {
					arr.splice(indexCrypto, 1)[0];
					await StorageST.addValue(
						StorageST.CRYPTOS_ST,
						JSON.stringify(arr)
					);
				}
			};
			const cryptos = JSON.parse(
				await StorageST.getValue(StorageST.CRYPTOS_ST)
			);
			doDelete(cryptos);
			doDelete(this.cryptos);
			this.totalRows = this.cryptos.length;
			this.onCloseModalDelete();
		},
		onCloseModalDelete: function() {
			this.$refs.modalConfirmDelete.hide();
			this.toggleBusy();
			this.$refs.table.refresh();
		},
		async onSelectCrypto(selectedCrypto) {
			const cryptos = JSON.parse(
				await StorageST.getValue(StorageST.CRYPTOS_ST)
			);
			const indexCrypto = cryptos.findIndex(
				c =>
					c.exchange === selectedCrypto.exchange &&
					c.id === selectedCrypto.id
			);
			if (indexCrypto === -1) {
				selectedCrypto.quantity = Number(0);
				cryptos.push(selectedCrypto);
				await StorageST.addValue(
					StorageST.CRYPTOS_ST,
					JSON.stringify(cryptos)
				);
				this.cryptos = cryptos;
				this.totalRows = this.cryptos.length;
				this.selectedCrypto = null;
			}
		},
		async onChangeQuantityCrypto(selectedCrypto) {
			const cryptos = JSON.parse(
				await StorageST.getValue(StorageST.CRYPTOS_ST)
			);
			const indexCrypto = cryptos.findIndex(
				c =>
					c.exchange === selectedCrypto.exchange &&
					c.id === selectedCrypto.id
			);
			if (indexCrypto > -1) {
				const cryptoDeleted = cryptos.splice(indexCrypto, 1)[0];
				cryptoDeleted.quantity = Number(selectedCrypto.quantity);
				cryptos.push(cryptoDeleted);
				await StorageST.addValue(
					StorageST.CRYPTOS_ST,
					JSON.stringify(cryptos)
				);
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
	async mounted() {
		if (await StorageST.has(StorageST.CRYPTOS_ST)) {
			this.cryptos = JSON.parse(
				await StorageST.getValue(StorageST.CRYPTOS_ST)
			);
			this.totalRows = this.cryptos.length;
		}
	},
	created() {
		EventBus.$on("update-cryptos-table", data => {
			this.cryptos = data;
			this.$refs.table.refresh();
			this.$refs.table.$forceUpdate();
		});
	}
};
</script>
<style lang="scss">
.col-quantity-crypto {
	width: 140px;
}
</style>
