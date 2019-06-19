const DOMAIN = 'https://.priceline.com';

export const CGUID_COOKIE_NANE = 'SITESERVER';

export const getCookie = (name, callback) => {
  chrome.cookies.get({ url: DOMAIN, name }, (cookie) => {
    if (callback) {
      callback(cookie.value);
    }
  });
};

export const setCookie = (name, value, callback) => {
  chrome.cookies.set({ url: DOMAIN, name, value, path: '/' }, (cookie) => {
    if (callback) {
      callback(cookie.value);
    }
  });
};
