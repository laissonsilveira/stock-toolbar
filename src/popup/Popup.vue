<template>
	<b-container>
		<b-tabs small fill nav-class="bg-dark" active-nav-item-class="font-weight-bold bg-info">
			<b-tab title="Stocks" title-link-class="text-light" title-item-class="outline-info" active>
				<b-list-group>
					<b-list-group-item
						class="flex-column align-items-start bg-dark text-light"
						href="#"
						v-show="stocks.length === 0"
					>
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1 symbol">Add yours Stocks in Options page</h6>
							<b-button block variant="outline-info" @click="openOptionsPage">Go to options</b-button>
						</div>
					</b-list-group-item>
					<b-list-group-item class="bg-dark" v-show="stocks.length > 0">
						<b-button size="sm" block variant="outline-info" @click="openOptionsPage">Go to options</b-button>
					</b-list-group-item>
					<b-list-group-item
						class="flex-column align-items-start bg-dark text-light"
						v-for="stock in stocks"
						:key="stock.symbol"
						:href="localStorage.getItem('selectedEngine')+stock.symbol"
						target="_blank"
					>
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1 symbol text-info">{{stock.symbol}}</h6>
							<label class="text-muted">
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!stock.detail.price && !containsError"
								></b-spinner>
								<div v-show="containsError" class="text-light">No internet&nbsp;</div>
								<div v-show="stock.detail.price">
									<b-badge :variant="getBadgeColor(stock.detail.changePercent)" pill>{{ stock.detail.changePercent }}%</b-badge>&nbsp;
									<strong class="text-light">{{ stock.detail.price }}</strong>
									<small class="text-muted">{{ stock.currency }}</small>
								</div>
							</label>
						</div>

						<div class="d-flex w-100 justify-content-between">
							<p class="mb-1 text-muted">{{stock.name}}</p>
							<small class="text-muted font-italic">{{stock.date}}</small>
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
								<b-icon
									class="font-weight-bold"
									v-show="containsError"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="stock.detail.open">{{ stock.detail.open }}</div>
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
								<b-icon
									class="font-weight-bold"
									v-show="containsError"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="stock.detail.high">{{ stock.detail.high }}</div>
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
								<b-icon
									class="font-weight-bold"
									v-show="containsError"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="stock.detail.low">{{ stock.detail.low }}</div>
							</small>
							<small class="text-muted">
								<strong>Vol</strong>
								<br />
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!stock.detail.volume && !containsError"
								></b-spinner>
								<b-icon
									class="font-weight-bold"
									v-show="containsError"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="stock.detail.volume">{{ stock.detail.volume }}</div>
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
								<b-icon
									class="font-weight-bold"
									v-show="containsError"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div
									class="text-light font-weight-bold"
									v-show="stock.detail.price"
								>{{ Number(stock.quantity * stock.detail.price).toFixed(2) }}</div>
							</small>
						</div>
					</b-list-group-item>
				</b-list-group>
			</b-tab>
			<b-tab
				title="Cryptos"
				title-link-class="text-light"
				title-item-class="outline-info"
			>
				<b-list-group>
					<b-list-group-item class="bg-dark">
						<b-button size="sm" block variant="outline-info" @click="openOptionsPage">Go to options</b-button>
					</b-list-group-item>
					<b-list-group-item
						class="flex-column align-items-start bg-dark text-light"
						v-for="crypto in cryptos"
						:key="crypto.id+crypto.exchange"
					>
						<div class="d-flex w-100 justify-content-between">
							<h6 class="mb-1 symbol text-info">{{crypto.symbol}}</h6>
							<label class="text-muted">
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!crypto.last && !containsErrorCrypto"
								></b-spinner>
								<div v-show="containsErrorCrypto" class="text-light">No internet&nbsp;</div>
								<div v-show="crypto.last">
									<b-badge :variant="getBadgeColor(crypto.lastVariation)" pill>{{ crypto.lastVariation }}%</b-badge>&nbsp;
									<strong class="text-light">{{ crypto.last }}</strong>
									<small class="text-muted">{{ crypto.currency }}</small>
								</div>
							</label>
						</div>

						<div class="d-flex w-100 justify-content-between">
							<p class="mb-1 text-muted">{{crypto.exchange}}</p>
							<small class="text-muted font-italic">{{crypto.createdDate}}</small>
							<b-icon
								class="font-weight-bold"
								v-show="containsErrorCrypto"
								icon="circle-slash"
								variant="danger"
							></b-icon>
						</div>

						<div class="d-flex w-100 justify-content-between text-light">
							<small class="text-muted">
								<strong>High</strong>
								<br />
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!crypto.high && !containsErrorCrypto"
								></b-spinner>
								<b-icon
									class="font-weight-bold"
									v-show="containsErrorCrypto"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="crypto.high">{{ crypto.high }}</div>
							</small>
							<small class="text-muted">
								<strong>Low</strong>
								<br />
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!crypto.low && !containsErrorCrypto"
								></b-spinner>
								<b-icon
									class="font-weight-bold"
									v-show="containsErrorCrypto"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="crypto.low">{{ crypto.low }}</div>
							</small>
							<small class="text-muted">
								<strong>Vol</strong>
								<br />
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!crypto.vol && !containsErrorCrypto"
								></b-spinner>
								<b-icon
									class="font-weight-bold"
									v-show="containsErrorCrypto"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div class="text-light" v-show="crypto.vol">{{ crypto.vol }}</div>
							</small>
							<small class="text-muted">
								<strong>Own</strong>
								<br />
								<b-spinner
									small
									class="align-middle"
									type="grow"
									v-show="!crypto.last && !containsErrorCrypto"
								></b-spinner>
								<b-icon
									class="font-weight-bold"
									v-show="containsErrorCrypto"
									icon="circle-slash"
									variant="danger"
								></b-icon>
								<div
									class="text-light font-weight-bold"
									v-show="crypto.last"
								>{{ Number((crypto.quantity || 0) * crypto.last).toFixed(2) }}</div>
							</small>
						</div>
					</b-list-group-item>
				</b-list-group>
			</b-tab>
		</b-tabs>
	</b-container>
</template>

<script>
import StocksAPI from "../js/api-st";
import moment from "moment";
export default {
	data() {
		return {
			cryptos: [],
			stocks: [],
			isBusy: false,
			posts: [],
			selectedID: null,
			fields: ["detail"],
			localStorage,
			containsError: false,
			containsErrorCrypto: false
		};
	},
	methods: {
		toggleBusy() {
			this.isBusy = !this.isBusy;
		},
		getBadgeColor(percent) {
			if (percent === "0.00") {
				return "primary";
			} else if (percent && percent.includes("-")) {
				return "danger";
			} else {
				return "success";
			}
		},
		async getStockDetail(symbol) {
			try {
				const attrib = "Global Quote";

				const res = await StocksAPI.GLOBAL_QUOTE(symbol);
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
					setTimeout(() => this.getStockDetail(symbol), 60000);
				} else {
					const stock = this.stocks.find(s => s.symbol === symbol);
					stock.date = moment().format("YYYY-MM-DD HH:mm:ss");
					stock.detail = {
						open: Number(res[attrib]["02. open"]).toFixed(2),
						high: Number(res[attrib]["03. high"]).toFixed(2),
						low: Number(res[attrib]["04. low"]).toFixed(2),
						price: Number(res[attrib]["05. price"]).toFixed(2),
						volume: res[attrib]["06. volume"],
						change: Number(res[attrib]["09. change"]).toFixed(2),
						changePercent: Number(
							res[attrib]["10. change percent"].replace("%", "")
						).toFixed(2)
					};
					localStorage.setItem(stock.symbol, JSON.stringify(stock));
				}
			} catch (error) {
				console.error(error);
				this.containsError = true;
			}
		},
		openOptionsPage() {
			chrome.runtime.openOptionsPage();
		}
	},
	async mounted() {
		if (localStorage.stocksST) {
			this.toggleBusy();

			const stocks = JSON.parse(localStorage.getItem("stocksST"));
			for (const s of stocks) {
				if (s.isEnabled) {
					const {
						"1. symbol": symbol,
						"2. name": name,
						"8. currency": currency,
						quantity
					} = s;
					const stock = {};
					stock.symbol = symbol;
					stock.name = name;
					stock.currency = currency;
					stock.quantity = quantity;
					stock.detail = {};

					this.stocks.push(stock);
					this.getStockDetail(symbol);
				}
			}

			this.cryptos = JSON.parse(localStorage.getItem("cryptosST"));
			fetch("https://watcher.foxbit.com.br/api/Ticker")
				.then(response => response.json())
				.then(cryptos => {
					try {
						for (const cryp of cryptos) {
							const criptoFound = this.cryptos.find(
								c =>
									c.exchange === cryp.exchange &&
									c.id === cryp.currency
							);
							if (criptoFound) {
								criptoFound.high = Number(cryp.high).toFixed(2);
								criptoFound.low = Number(cryp.low).toFixed(2);
								criptoFound.last = Number(cryp.last).toFixed(2);
								criptoFound.vol = Number(cryp.vol).toFixed(2);
								criptoFound.lastVariation = Number(
									cryp.lastVariation
								).toFixed(2);
								criptoFound.createdDate = moment(cryp.createdDate).format('YYYY-MM-DD HH:mm:ss');
							}
						}
					} catch (error) {
						console.error(error);
						this.containsErrorCrypto = true;
					}
				});

			this.toggleBusy();
		}
	}
};
</script>
<style lang="scss">
@font-face {
	font-family: "Wallstreet";
	src: url("/fonts/wallstreet.eot");
	src: url("/fonts/wallstreet.ttf") format("truetype");
	font-weight: normal;
	font-style: normal;
}
.symbol {
	font-family: "Wallstreet";
}
body {
	padding: 0;
	margin: 0;
	width: 400px;
	background-color: #1d2124;
}
.container {
	margin: 0;
	padding: 0;
}
.hidden_header {
	display: none;
}
</style>
