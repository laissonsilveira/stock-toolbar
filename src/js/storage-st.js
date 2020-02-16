export default class StorageST {

    static get STOCKS_ST() {
        return 'stocksST';
    }

    static get CRYPTOS_ST() {
        return 'cryptosST';
    }

    static get SYNC_TYPE() {
        return 'sync';
    }

    static get LOCAL_TYPE() {
        return 'local';
    }

    static addValue(key, value, arg = StorageST.SYNC_TYPE) {
        return new Promise((resolve, reject) => {
            if (!key) {
                reject('key is required');
            } else {
                const stg = {};
                stg[key] = value;
                chrome.storage[arg].set(stg, resolve);
            }
        });
    }

    static getValue(key, arg = StorageST.SYNC_TYPE) {
        return new Promise((resolve, reject) => {
            if (!key) return reject('key is required');
            chrome.storage[arg].get(key, result => resolve(result[key]));
        });
    }

    static has(key, arg = StorageST.SYNC_TYPE) {
        return new Promise((resolve, reject) => {
            if (!key) return reject('key is required');
            chrome.storage[arg].get(key, result => resolve(!!result[key]));
        });
    }

    static removeValue(key, arg = StorageST.SYNC_TYPE) {
        return new Promise((resolve, reject) => {
            if (!key) return reject('key is required');
            chrome.storage[arg].remove(key, resolve);
        });
    }

}