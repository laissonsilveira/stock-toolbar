<template>
	<b-tab title="Stocks" title-link-class="text-light" title-item-class="outline-info" active>
		<b-list-group>
			<b-list-group-item
				class="flex-column align-items-start bg-dark text-light"
				href="#"
				v-show="stocks.length === 0"
			>
				<div class="d-flex w-100 justify-content-between">
					<h6 class="mb-1 symbol">Add yours Stocks in Options page</h6>
					<b-button block variant="outline-info" @click="$emit('openOptionsPage')">Go to options</b-button>
				</div>
			</b-list-group-item>
			<b-list-group-item class="bg-dark" v-show="stocks.length > 0">
				<div class="d-flex w-100 justify-content-between">
					<label class="font-weight-bold text-light">Total: {{ getTotalStocks() | toCurrency }}</label>
					<b-button size="sm" variant="outline-info" @click="$emit('openOptionsPage')">Go to options</b-button>
				</div>
			</b-list-group-item>
			<b-list-group-item
				class="flex-column align-items-start bg-dark text-light"
				v-for="stock in stocks"
				:key="stock.symbol"
				:href="localStorage.getItem('selectedEngine') + stock.symbol"
				target="_blank"
			>
				<div class="d-flex w-100 justify-content-between">
					<h6 class="mb-1 symbol text-info">{{ stock.symbol }}</h6>
					<label class="text-muted">
						<b-spinner
							small
							class="align-middle"
							type="grow"
							v-show="!stock.detail.price && !containsError"
						></b-spinner>
						<div v-show="containsError" class="text-light">Did something wrong happen&nbsp;</div>
						<div v-show="stock.detail.price">
							<b-badge
								:variant="getBadgeColor(stock.detail.changePercent)"
								pill
							>{{ stock.detail.changePercent }}%</b-badge>&nbsp;
							<strong class="text-light">{{ stock.detail.price | exchangeCurrency(stock.currency) }}</strong>
							<small class="text-muted">{{ localStorage.getItem("currencyStock") }}</small>
						</div>
					</label>
				</div>

				<div class="d-flex w-100 justify-content-between">
					<p class="mb-1 text-muted">{{ stock.name }}</p>
					<small class="text-muted font-italic">{{ stock.date }}</small>
					<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
				</div>

				<div class="d-flex w-100 justify-content-between text-light">
					<small class="text-muted">
						<strong>Open</strong>
						<br />
						<b-spinner
							small
							class="align-middle"
							type="grow"
							v-show="!stock.detail.open && !containsError"
						></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div
							class="text-light price-detail"
							v-show="stock.detail.open"
						>{{ stock.detail.open | exchangeCurrency(stock.currency) }}</div>
					</small>
					<small class="text-muted">
						<strong>High</strong>
						<br />
						<b-spinner
							small
							class="align-middle"
							type="grow"
							v-show="!stock.detail.high && !containsError"
						></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div
							class="text-light price-detail"
							v-show="stock.detail.high"
						>{{ stock.detail.high | exchangeCurrency(stock.currency) }}</div>
					</small>
					<small class="text-muted">
						<strong>Low</strong>
						<br />
						<b-spinner
							small
							class="align-middle"
							type="grow"
							v-show="!stock.detail.low && !containsError"
						></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div
							class="text-light price-detail"
							v-show="stock.detail.low"
						>{{ stock.detail.low | exchangeCurrency(stock.currency) }}</div>
					</small>
					<small class="text-muted">
						<strong>Own</strong>
						<br />
						<b-spinner
							small
							class="align-middle"
							type="grow"
							v-show="!stock.detail.price && !containsError"
						></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div class="text-light font-weight-bold price-detail" v-show="stock.detail.price">
							{{ getOwn(stock.quantity, stock.detail.price) | exchangeCurrency(stock.currency) }}
							&nbsp;({{Number(stock.quantity).toFixed(2)}}un)
						</div>
					</small>
				</div>
			</b-list-group-item>
		</b-list-group>
	</b-tab>
</template>

<script>
import StocksAPI from "../js/api-st";
import StorageST from "../js/storage-st";
import moment from "moment";
export default {
	data() {
		return {
			stocks: [],
			localStorage,
			containsError: false
		};
	},
	methods: {
		getOwn(quantity, price) {
			if (!quantity || !price) return 0;
			return Number(quantity * price);
		},
		getBadgeColor(percent) {
			if (percent == "0.00") {
				return "primary";
			} else if (percent && percent.toString().includes("-")) {
				return "danger";
			} else {
				return "success";
			}
		},
		getTotalStocks() {
			let total = 0;
			this.stocks.forEach(stock => {
				if (stock.isEnabled && stock.detail && stock.detail.price)
					total += this.$options.filters.exchangeCurrency(
						stock.quantity * stock.detail.price,
						stock.currency,
						true
					);
			});
			return Number(total).toFixed(2);
		},
		async getStockDetail(symbol, key) {
			try {
				const attrib = "Global Quote";

				const res = await StocksAPI.GLOBAL_QUOTE(symbol, key || null);
				if (res.Note) {
					let stock = JSON.parse(localStorage.getItem(symbol));
					if (stock && stock.detail && stock.detail.open) {
						const stockOld = this.stocks.find(
							s => s.symbol === symbol
						);
						stockOld.date = stock.date;
						stockOld.quantity = stock.quantity;
						stockOld.detail = stock.detail;
					}
					setTimeout(() => this.getStockDetail(symbol, key), 60000);
				} else {
					const stock = this.stocks.find(s => s.symbol === symbol);
					stock.date = moment().format("YYYY-MM-DD HH:mm:ss");
					stock.detail = {
						open: Number(res[attrib]["02. open"]),
						high: Number(res[attrib]["03. high"]),
						low: Number(res[attrib]["04. low"]),
						price: Number(res[attrib]["05. price"]),
						volume: res[attrib]["06. volume"],
						change: Number(res[attrib]["09. change"]),
						changePercent: Number(
							res[attrib]["10. change percent"].replace("%", "")
						)
					};
					localStorage.setItem(stock.symbol, JSON.stringify(stock));
				}
			} catch (error) {
				console.error(error);
				this.containsError = true;
			}
		}
	},
	async mounted() {
		if (await StorageST.has(StorageST.STOCKS_ST)) {
			const stocks = JSON.parse(
				await StorageST.getValue(StorageST.STOCKS_ST)
			);
			let index = 0;
			for (const s of stocks) {
				if (s.isEnabled) {
					const {
						"1. symbol": symbol,
						"2. name": name,
						"8. currency": currency,
						quantity,
						isEnabled
					} = s;
					const stock = {};
					stock.symbol = symbol;
					stock.name = name;
					stock.currency = currency;
					stock.quantity = quantity;
					stock.isEnabled = isEnabled;
					stock.detail = {};

					this.stocks.push(stock);
					setTimeout(() => {
						this.getStockDetail(
							symbol,
							index < 5 && localStorage.getItem("keyST")
						);
						index++;
					}, 100 * index);
				}
			}
		}
	}
};
</script>