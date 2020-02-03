global.browser = require('webextension-polyfill');
import StocksAPI from './js/api-st';
StocksAPI.addHandlers();
StocksAPI.init();
!localStorage.stocksST && localStorage.setItem('stocksST', '[]');
!localStorage.selectedEngine && localStorage.setItem('selectedEngine', 'https://www.google.com/search?site=finance&tbm=fin&q=');