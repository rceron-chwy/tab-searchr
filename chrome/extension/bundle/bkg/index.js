import debug from 'debug';
import { fetchTimeout } from '../../../../app/utils/customFetch';

const bluebird = require('bluebird');

const log = debug('rfc.bkg.index');

global.Promise = bluebird;

function promisifier(method) {
  return function promisified(...args) {
    return new Promise((resolve) => {
      args.push(resolve);
      method.apply(this, args);
    });
  };
}

function promisifyAll(obj, list) {
  list.forEach(api => bluebird.promisifyAll(obj[api], { promisifier }));
}

// let chrome extension api support Promise
promisifyAll(chrome, [
  'tabs',
  'windows',
  'browserAction',
  // 'contextMenus'
]);

promisifyAll(chrome.storage, [
  'sync',
]);


/**
 * Possible parameters for request:
 *  action: "xhttp" for a cross-origin HTTP request
 *  method: Default "GET"
 *  url   : required, but not validated
 *  data  : data to send in a POST request
 *
 * The callback function is called upon completion of the request */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  log('Listener for', request.url);
  fetchTimeout(request.url, {
    method: 'POST',
    cache: 'no-cache',
    accept: 'application/json',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      Accept: 'application/json',
    },
    body: request.data
  }, 10000)
    .then(res => res.json())
    .then((responseObj) => {
      sendResponse(responseObj);
    })
    .catch((err) => {
      sendResponse(err);
    });

  return true;
});

// require('./inject');
