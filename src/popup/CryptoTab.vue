<template>
	<b-tab title="Cryptos" title-link-class="text-light" title-item-class="outline-info">
		<b-list-group>
			<b-list-group-item class="bg-dark">
				<div class="d-flex w-100 justify-content-between">
					<label class="font-weight-bold text-light">Total: {{ getTotalCryptos() | toCurrency }}</label>
					<b-button size="sm" variant="outline-info" @click="$emit('openOptionsPage')">Go to options</b-button>
				</div>
			</b-list-group-item>
			<b-list-group-item
				class="flex-column align-items-start bg-dark text-light"
				v-for="crypto in cryptos"
				:key="crypto.id + crypto.exchange"
				:href="crypto.url"
				target="_blank"
			>
				<div class="d-flex w-100 justify-content-between">
					<h6 class="mb-1 symbol text-info">
						<b-img left :src="getSrcImage(crypto.symbol)" width="20" height="20"></b-img>
						&nbsp;
						{{ crypto.symbol }}
					</h6>
					<label class="text-muted">
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.last && !containsError"></b-spinner>
						<div v-show="containsError" class="text-light">No internet&nbsp;</div>
						<div v-show="crypto.last">
							<b-badge :variant="getBadgeColor(crypto.lastVariation)" pill>{{ crypto.lastVariation }}%</b-badge>&nbsp;
							<strong class="text-light">{{ crypto.last | exchangeCurrency(crypto.currency) }}</strong>
							<small class="text-muted">{{ localStorage.getItem("currencyStock") }}</small>
						</div>
					</label>
				</div>

				<div class="d-flex w-100 justify-content-between">
					<p class="mb-1 text-muted">{{ crypto.exchange }}</p>
					<small class="text-muted font-italic">
						{{
						crypto.createdDate
						}}
					</small>
					<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
				</div>

				<div class="d-flex w-100 justify-content-between text-light">
					<small class="text-muted">
						<strong>High</strong>
						<br />
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.high && !containsError"></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div
							class="text-light price-detail"
							v-show="crypto.high"
						>{{ crypto.high | exchangeCurrency(crypto.currency) }}</div>
					</small>
					<small class="text-muted">
						<strong>Low</strong>
						<br />
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.low && !containsError"></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div
							class="text-light price-detail"
							v-show="crypto.low"
						>{{ crypto.low | exchangeCurrency(crypto.currency) }}</div>
					</small>
					<small class="text-muted">
						<strong>Own</strong>
						<br />
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.last && !containsError"></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div class="text-light font-weight-bold price-detail" v-show="crypto.last">
							{{ getOwn(crypto.quantity || 0, crypto.last) | exchangeCurrency(crypto.currency) }}
							&nbsp;({{Number(crypto.quantity).toFixed(2)}}un)
						</div>
					</small>
				</div>
			</b-list-group-item>
		</b-list-group>
	</b-tab>
</template>

<script>
import StorageST from "../js/storage-st";
import moment from "moment";
export default {
	data() {
		return {
			cryptos: [],
			isBusy: false,
			fields: ["detail"],
			localStorage,
			containsError: false
		};
	},
	methods: {
		getTotalCryptos() {
			let total = 0;
			this.cryptos.forEach(crypto => {
				if (crypto.last)
					total += this.$options.filters.exchangeCurrency(
						crypto.quantity * crypto.last,
						crypto.currency,
						true
					);
			});
			return Number(total).toFixed(2);
		},
		getSrcImage(symbol) {
			return `/icons/${symbol}.png`;
		},
		getOwn(quantity, price) {
			if (!quantity || !price) return 0;
			return Number(quantity * price);
		},
		getBadgeColor(percent) {
			if (percent === "0.00") {
				return "primary";
			} else if (percent && percent.includes("-")) {
				return "danger";
			} else {
				return "success";
			}
		}
	},
	async mounted() {
		if (await StorageST.has(StorageST.CRYPTOS_ST)) {
			this.$emit("toggleBusy");

			this.cryptos = JSON.parse(
				await StorageST.getValue(StorageST.CRYPTOS_ST)
			);
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
								criptoFound.high = Number(cryp.high);
								criptoFound.low = Number(cryp.low);
								criptoFound.last = Number(cryp.last);
								criptoFound.vol = Number(cryp.vol);
								criptoFound.lastVariation = Number(
									cryp.lastVariation
								);
								criptoFound.createdDate = moment(
									cryp.createdDate
								).format("YYYY-MM-DD HH:mm:ss");
							}
						}
					} catch (error) {
						console.error(error);
						this.containsError = true;
					}
				});

			this.$emit("toggleBusy");
		}
	}
};
</script>