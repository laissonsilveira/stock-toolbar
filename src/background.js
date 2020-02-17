global.browser = require("webextension-polyfill");
import StocksAPI from "./js/api-st";
import StorageST from "./js/storage-st";
StocksAPI.addHandlers();
StocksAPI.init();

!localStorage.selectedEngine &&
	localStorage.setItem(
		"selectedEngine",
		"https://www.google.com/search?site=finance&tbm=fin&q="
	);

!localStorage.currencyLocal && localStorage.setItem("currencyLocal", 'USD');

(async () => {
	if (!await StorageST.has(StorageST.STOCKS_ST))
		StorageST.addValue(StorageST.STOCKS_ST, '[]');
	if (!await StorageST.has(StorageST.CRYPTOS_ST))
		StorageST.addValue(StorageST.CRYPTOS_ST, '[]');
})();