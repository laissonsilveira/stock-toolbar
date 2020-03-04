<template>
	<div>
		<b-modal ref="modalConfirmDelete" hide-footer title="Delete Stock">
			<div class="container">
				<div class="row">
					<p>Are you sure you want to delete this item?</p>
					<div class="col-md-6 pl-0">
						<a
							href="#"
							v-on:click="deleteItem(selectedID)"
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
		<b-tab title="Stocks" title-link-class="text-light" title-item-class="outline-info" active>
			<b-row>
				<b-col>
					<b-form v-on:submit.prevent="onSaveEmail">
						<b-form-group label="Email address:" class="text-light">
							<b-input-group>
								<b-form-input
									type="email"
									v-model="email"
									placeholder="Enter your e-mail"
									:state="Boolean(email)"
								></b-form-input>
								<b-input-group-append>
									<b-button variant="outline-info" type="submit">Save</b-button>
									<!-- <b-button id="btn-google" type="button" variant="light">
                                        <b-img src="../icons/icon_google.png" height="20"></b-img>&nbsp;Sign in with Google
                                    </b-button>
                                    <b-tooltip target="btn-google" triggers="hover">
                                        Use to premium mode
									</b-tooltip>-->
								</b-input-group-append>
							</b-input-group>
						</b-form-group>
					</b-form>
					<b-row>
						<b-col>
							<b-form-group label="Engine to stock detail:" class="text-light">
								<b-form-select v-model="selectedEngine" :options="engines" @change="saveEngine"></b-form-select>
							</b-form-group>
						</b-col>
					</b-row>
					<b-form-group label="Select yours stocks:" class="text-light">
						<autocomplete
							ref="stock"
							:search="search"
							:get-result-value="getResultValue"
							@submit="handleSubmit"
							:debounce-time="500"
							placeholder="Search for symbols or companies"
							aria-label="Search for symbols or companies"
							:autoSelect="true"
							:disabled="!email"
						>
							<template #result="{ result, props }">
								<b-list-group v-bind="props" class="autocomplete-result">
									<b-list-group-item v-if="!result.code" class="flex-column align-items-start">
										<div class="d-flex w-100 justify-content-between">
											<h5 class="mb-1">{{ result["1. symbol"] }}</h5>
											<small>{{ result["8. currency"] }}</small>
										</div>
										<p class="mb-1">{{ result["2. name"] }}</p>
										<small>{{ result["4. region"] }}</small>
									</b-list-group-item>
									<b-list-group-item v-if="result.code === 404" class="flex-column align-items-start">
										<div class="d-flex w-100 justify-content-between">
											<h5 class="mb-1">No results found</h5>
										</div>
										<p class="mb-1">Try another term</p>
									</b-list-group-item>
								</b-list-group>
							</template>
						</autocomplete>
					</b-form-group>
				</b-col>
				<b-col>
					<b-table
						:busy="isBusy"
						ref="table"
						show-empty
						striped
						hover
						responsive
						dark
						bordered
						:items="stocks"
						:fields="fields"
						:current-page="currentPage"
						:per-page="perPage"
						:sort-by.sync="sortBy"
						:sort-desc.sync="sortDesc"
					>
						<template slot="1. symbol" slot-scope="data">
							{{
							data.item["1. symbol"] | truncate(30)
							}}
						</template>
						<template slot="2. name" slot-scope="data">
							{{
							data.item["2. name"] | truncate(50)
							}}
						</template>
						<template slot="8. currency" slot-scope="data">
							{{
							data.item["8. currency"]
							}}
						</template>
						<template v-slot:cell(quantity)="data">
							<b-form-input
								v-model="data.item.quantity"
								@change="onChangeQuantityStock(data.item)"
								type="number"
								size="sm"
							/>
						</template>
						<template v-slot:cell(actions)="data">
							<toggle-button
								@change="onToggleButton(data.item)"
								:labels="true"
								v-model="data.item.isEnabled"
								:sync="true"
							/>
							<a href="#" v-on:click="onDelete(data.item['1. symbol'])" class="h4">
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
		</b-tab>
	</div>
</template>
<script>
import StocksAPI from "../js/api-st";
import StorageST from "../js/storage-st";
import Autocomplete from "@trevoreyre/autocomplete-vue";
import { EventBus } from "./event-bus.js";
export default {
	name: "CryptoTab",
	components: {
		Autocomplete
	},
	data() {
		return {
			sortBy: "1. symbol",
			sortDesc: false,
			email: localStorage.getItem("emailST"),
			stocks: [],
			isBusy: false,
			posts: [],
			filter: null,
			currentPage: 1,
			perPage: 5,
			totalRows: null,
			selectedID: null,
			selectedEngine: localStorage.getItem("selectedEngine"),
			engines: [
				{
					text: "Google",
					value:
						"https://www.google.com/search?site=finance&tbm=fin&q="
				},
				{
					text: "Yahoo",
					value: "https://finance.yahoo.com/lookup?s="
				}
			],
			fields: [
				{
					key: "1. symbol",
					label: "Symbol",
					sortable: true
				},
				{
					key: "2. name",
					label: "Name",
					sortable: true,
					tdClass: "col-name-stock"
				},
				{
					key: "8. currency",
					label: "Currency"
				},
				{
					key: "quantity",
					tdClass: "col-quantity-stock"
				},
				{
					key: "actions",
					label: "",
					tdClass: "col-actions-stock text-right"
				}
			]
		};
	},
	methods: {
		async search(input) {
			if (input.length < 3) {
				return [];
			}
			const res = await StocksAPI.SYMBOL_SEARCH(input);
			if (!res || res.length === 0) return [{ code: 404 }];
			return res;
		},
		toggleBusy() {
			this.isBusy = !this.isBusy;
		},
		getResultValue(result) {
			if (result && result.code !== 404) return result["1. symbol"];
		},
		async handleSubmit(result) {
			if (result && result.code !== 404) {
				const stocks = JSON.parse(
					await StorageST.getValue(StorageST.STOCKS_ST)
				);
				if (stocks.filter(s => s.isEnabled).length < 10) {
					if (
						stocks.find(s => s["1. symbol"] === result["1. symbol"])
					) {
						this.showAlert(
							`${result["1. symbol"]} has already been added.`
						);
					} else {
						result.isEnabled = true;
						result.quantity = 0;
						stocks.push(result);
						this.totalRows = stocks.length;
						await StorageST.addValue(
							StorageST.STOCKS_ST,
							JSON.stringify(stocks)
						);
						this.stocks = stocks;
					}
				} else {
					this.showAlert(
						"It is possible to have a maximum of 10 stocks enabled in the list."
					);
				}
			}
			this.$refs.stock.setValue(null);
		},
		onDelete(id) {
			this.toggleBusy();
			this.selectedID = id;
			this.$refs.modalConfirmDelete.show();
		},
		async deleteItem(symbol) {
			const doDelete = async arr => {
				const indexStock = arr.findIndex(
					s => s["1. symbol"] === symbol
				);
				if (indexStock > -1) {
					arr.splice(indexStock, 1)[0];
					await StorageST.addValue(
						StorageST.STOCKS_ST,
						JSON.stringify(arr)
					);
				}
			};
			const stocks = JSON.parse(
				await StorageST.getValue(StorageST.STOCKS_ST)
			);
			doDelete(stocks);
			doDelete(this.stocks);
			this.totalRows = this.stocks.length;
			localStorage.removeItem(symbol);
			this.onCloseModalDelete();
		},
		onCloseModalDelete: function() {
			this.$refs.modalConfirmDelete.hide();
			this.toggleBusy();
			this.$refs.table.refresh();
		},
		async onToggleButton(stockItem) {
			const symbol = stockItem["1. symbol"];
			const stocks = JSON.parse(
				await StorageST.getValue(StorageST.STOCKS_ST)
			);
			const indexStock = stocks.findIndex(s => s["1. symbol"] === symbol);
			if (indexStock > -1) {
				if (
					(stockItem.isEnabled &&
						stocks.filter(s => s.isEnabled).length < 10) ||
					!stockItem.isEnabled
				) {
					const stockDeleted = stocks.splice(indexStock, 1)[0];
					stockDeleted.isEnabled = stockItem.isEnabled;
					stocks.push(stockDeleted);
					await StorageST.addValue(
						StorageST.STOCKS_ST,
						JSON.stringify(stocks)
					);
				} else {
					stockItem.isEnabled = !stockItem.isEnabled;
					this.showAlert(
						"It is possible to have a maximum of 10 stocks enabled in the list."
					);
				}
			}
		},
		async onChangeQuantityStock(stockItem) {
			const symbol = stockItem["1. symbol"];
			const stocks = JSON.parse(
				await StorageST.getValue(StorageST.STOCKS_ST)
			);
			const indexStock = stocks.findIndex(s => s["1. symbol"] === symbol);
			if (indexStock > -1) {
				const stockDeleted = stocks.splice(indexStock, 1)[0];
				stockDeleted.quantity = Number(stockItem.quantity);
				stocks.push(stockDeleted);
				await StorageST.addValue(
					StorageST.STOCKS_ST,
					JSON.stringify(stocks)
				);
			}
			if (localStorage.getItem(symbol)) {
				const stock = JSON.parse(localStorage.getItem(symbol));
				stock.quantity = Number(stockItem.quantity);
				localStorage.setItem(symbol, JSON.stringify(stock));
			}
		},
		saveEngine() {
			localStorage.setItem("selectedEngine", this.selectedEngine);
		},
		onSaveEmail() {
			if (!this.email) return this.showAlert("E-mail is required!");
			localStorage.setItem("emailST", this.email);
			this.showAlert("Email saved successfully", "success");
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
		if (await StorageST.has(StorageST.STOCKS_ST)) {
			this.stocks = JSON.parse(
				await StorageST.getValue(StorageST.STOCKS_ST)
			);
			this.totalRows = this.stocks.length;
		}
	},
	created() {
		EventBus.$on("update-stocks-table", data => {
			this.stocks = data;
			this.$refs.table.refresh();
			this.$refs.table.$forceUpdate();
		});
	}
};
</script>
<style lang="scss">
.col-actions-stock {
	min-width: 110px;
}
.col-name-stock {
	min-width: 200px;
}
.col-quantity-stock {
	min-width: 120px;
}

.autocomplete-result {
	color: #212529;
}

.autocomplete-result:hover,
.autocomplete-result[aria-selected="true"] {
	background-color: #6c757d;
}

.autocomplete[data-loading="true"]:after {
	background-color: transparent;
	border: 3px solid #17a2b8;
	border-right-color: #ffffff;
}
</style>
