import debug from 'debug';
import moment from 'moment';

const log = debug('rfc.storage');

// ~ Storage Constants
export const STORAGE_RATES_KEY = 'rates';

// ~ Storage methods
export const saveRate = ({ rateId, hotelId, data }, callback) => {
  chrome.storage.local.get(STORAGE_RATES_KEY, (result) => {
    const rates = {
      ...result.rates,
      [`${rateId}`]: {
        rateId,
        hotelId,
        lastUpdated: moment().format('YYYY-MM-DD HH:mm:ss'),
        data
      }
    };
    log(`Will save id ${rateId}`, rates);
    chrome.storage.local.set({ rates }, () => {
      log(`Value set for id ${rateId}`, rates);
      if (callback) callback(rateId);
    });
  });
};

export const deleteRate = (rateId, callback) => {
  chrome.storage.local.get(STORAGE_RATES_KEY, (result) => {
    const rates = result.rates;
    delete rates[rateId];
    log(`Will delete rateId ${rateId}`, rates);
    chrome.storage.local.set({ rates }, () => {
      log(`Value set for id ${rateId}`, rates);
      if (callback) callback(rateId);
    });
  });
};

export const loadRate = (rateId, callback) => {
  chrome.storage.local.get([STORAGE_RATES_KEY], (data) => {
    if (data && data.rates && data.rates[rateId]) {
      const selected = data.rates[rateId];
      callback(selected);
    }
  });
};

export const loadRates = (callback) => {
  chrome.storage.local.get([STORAGE_RATES_KEY], (data) => {
    log('loadRates', data);
    if (data && data.rates) {
      callback(data.rates);
    }
  });
};

export const getKey = (key, callback) => {
  chrome.storage.local.get(key, (result) => {
    log('GET KEY FROM STORAGE', key, result);
    callback((result && result[key]) || false);
  });
};

export const saveKey = (key, value) => {
  chrome.storage.local.set({ [key]: value }, () => {
    log('SET KEY INTO STORAGE', key, value);
  });
};
