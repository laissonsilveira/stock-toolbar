//eslint-disable-next-line
export default class StocksAPI {

	static init() {
		if (!localStorage.getItem('tokenST') || !localStorage.getItem('keyST')) {
			fetch('https://www.alphavantage.co/support/#api-key');
		}
		else {
			!localStorage.getItem('keyST') && StocksAPI.getAPIkey();
		}
	}

	static addHandlers() {
		chrome.webRequest.onBeforeSendHeaders.addListener(
			function (details) {
				const token = localStorage.getItem('tokenST');
				StocksAPI.changeHeader(details, 'Referer', 'https://www.alphavantage.co/support/');
				StocksAPI.changeHeader(details, 'X-CSRFToken', token);
				StocksAPI.changeHeader(details, 'Cookie', `csrftoken=${token}`);
				StocksAPI.changeHeader(details, 'Origin', 'https://www.alphavantage.co');
				return { requestHeaders: details.requestHeaders };
			},
			{ urls: ['https://www.alphavantage.co/create_post/'] }, ['blocking', 'requestHeaders', 'extraHeaders']
		);

		chrome.webRequest.onHeadersReceived.addListener(
			function (details) {
				const cookie = details.responseHeaders.find(obj => obj.name === 'Set-Cookie').value;
				const token = StocksAPI.getCookieValue(cookie, 'csrftoken');
				if (!token) {
					throw new Error('Token not found!');
				}
				localStorage.setItem('tokenST', token);
				const tokenExpires = StocksAPI.getCookieValue(cookie, 'expires');
				StocksAPI.getAPIkey();
			},
			{ urls: ['https://www.alphavantage.co/support/*'] }, ['responseHeaders', 'extraHeaders']
		);
	}

	static getAPIkey() {
		chrome.identity.getProfileUserInfo(info => {
			const formData = new FormData();
			formData.append('email_text', info.email);
			localStorage.setItem('emailST', info.email);
			const requestOptions = { method: 'POST', body: formData };
			fetch('https://www.alphavantage.co/create_post/', requestOptions)
				.then(response => response.text())
				.then(result => {
					let containsError = false;
					if (result) {
						try {
							result = JSON.parse(result);
							const key = result.text.match(/[A-Z0-9]{16}/g);
							if (!key) {
								containsError = true;
							} else {
								localStorage.setItem('keyST', key);
							}
						} catch (error) {
							containsError = true;
						}
					} else {
						containsError = true;
					}

					if (containsError) throw new Error('Key not found!');
					// {"text": "It seems that you are already a registered user. As a reminder, your API key is: 2PQ5ABZ1TD6ORY67. Thank you!", "result": "Create post successful!"}
					// {"text": "Welcome to Alpha Vantage! Here is your API key: 9TRYH6RB6JXW9DJW. Please record this API key for future access to Alpha Vantage.", "result": "Create post successful!"}
				})
				.catch(error => console.log('error', error));
		});
	}

	static changeHeader(details, name, value) {
		const index = details.requestHeaders.findIndex(obj => obj.name === name);
		if (index === -1) {
			details.requestHeaders.push({ name, value });
		}
		else {
			details.requestHeaders[index].value = value;
		}
	}

	static getCookieValue(cookie, name) {
		const b = cookie.match('(^|[^;]+)\\s*' + name + '\\s*=\\s*([^;]+)');
		return b ? b.pop() : '';
	}

	static async SYMBOL_SEARCH(keywords) {
		const res = await fetch(`https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${keywords}&apikey=${localStorage.getItem('keyST')}`)
			.then(response => response.json());
		return res.bestMatches;
	}

	static async TIME_SERIES_DAILY(symbol, outputsize = 'compact') {
		const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${localStorage.getItem('keyST')}`)
			.then(response => response.json());
		return res;
	}

	static async TIME_SERIES_INTRADAY(symbol, interval = '5min', outputsize = 'compact') {
		const res = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${localStorage.getItem('keyST')}`)
			.then(response => response.json());
		return res;
	}

	static async GLOBAL_QUOTE(symbol) {
		const res = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${localStorage.getItem('keyST')}`)
			.then(response => response.json());
		return res;
	}

}