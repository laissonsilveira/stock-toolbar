<template>
	<b-tab title="Cryptos" title-link-class="text-light" title-item-class="outline-info">
		<b-list-group>
			<b-list-group-item class="bg-dark">
				<div class="d-flex w-100 justify-content-between">
					<label
						class="font-weight-bold text-light"
					>Total: {{ Number(totalCryptos).toFixed(2) | toCurrency }}</label>
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
							<strong class="text-light">{{ crypto.last | toCurrency(crypto.currency) }}</strong>
							<small class="text-muted">{{ crypto.currency }}</small>
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
						<div class="text-light price-detail" v-show="crypto.high">{{ crypto.high | toCurrency }}</div>
					</small>
					<small class="text-muted">
						<strong>Low</strong>
						<br />
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.low && !containsError"></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div class="text-light price-detail" v-show="crypto.low">{{ crypto.low | toCurrency }}</div>
					</small>
					<small class="text-muted">
						<strong>Own</strong>
						<br />
						<b-spinner small class="align-middle" type="grow" v-show="!crypto.last && !containsError"></b-spinner>
						<b-icon class="font-weight-bold" v-show="containsError" icon="circle-slash" variant="danger"></b-icon>
						<div class="text-light font-weight-bold price-detail" v-show="crypto.last">
							{{ getOwn(crypto.quantity || 0, crypto.last, crypto.currency) | toCurrency }}
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
			containsError: false,
			totalCryptos: 0
		};
	},
	methods: {
		getSrcImage(symbol) {
			return `/icons/${symbol}.png`;
        },
        _exchangeCurrency(val, currency) {
			return (
				val *
				JSON.parse(localStorage.getItem("exchanges")).rates[currency]
			);
		},
		getOwn(quantity, price, currency) {
			console.log(quantity, price, currency);
			if (!quantity || !price || !currency) return 0;
			return Number(
				quantity * this._exchangeCurrency(price, currency)
			).toFixed(2);
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
	},
	async mounted() {
		if (await StorageST.has(StorageST.CRYPTOS_ST)) {
			this.$emit('toggleBusy');

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
								criptoFound.high = Number(cryp.high).toFixed(2);
								criptoFound.low = Number(cryp.low).toFixed(2);
								criptoFound.last = Number(cryp.last).toFixed(2);
								criptoFound.vol = Number(cryp.vol).toFixed(2);
								criptoFound.lastVariation = Number(
									cryp.lastVariation
								).toFixed(2);
								criptoFound.createdDate = moment(
									cryp.createdDate
								).format("YYYY-MM-DD HH:mm:ss");

								this.totalCryptos +=
									criptoFound.quantity * criptoFound.last;
							}
						}
					} catch (error) {
						console.error(error);
						this.containsError = true;
					}
				});

			this.$emit('toggleBusy');
		}
	}
};
</script>