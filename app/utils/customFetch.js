import moment from 'moment';
import debug from 'debug';

const log = debug('rfc.customFetch');

export const fetchTimeout = (url, options, timeout = 10000) => {
  log(`Fetch started for: ${url} with timeout of: ${timeout}`);
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), timeout);
    })
  ]);
};

export const rguidGenerator = () => {
  const rguidTime = moment();
  return `${rguidTime.format('YYYYMMDDHHmmssSSS')}-${rguidTime.format('X')}-PHD_SYNTHETIC_CACHE`;
};

