const isInjected = (tabId) => {
  return chrome.tabs.executeScriptAsync(tabId, {
    code: 'var injected = window.chewyDebuggerInject; window.chewyDebuggerInject = true; injected;',
    runAt: 'document_start'
  });
};

const doScript = (name, tabId, cb) => {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript(tabId, { file: `/js/${name}.bundle.js`, runAt: 'document_end' }, cb);
  } else {
    // dev: async fetch bundle
    fetch(`http://localhost:3000/js/${name}.bundle.js`)
    .then(res => res.text())
    .then((fetchRes) => {
      chrome.tabs.executeScript(tabId, { code: fetchRes, runAt: 'document_end' }, cb);
    });
  }
};

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status !== 'loading' || !tab.url.match('^https://.*\\.chewy\\.com')) return;

  const result = await isInjected(tabId);
  if (chrome.runtime.lastError || result[0]) return;

  // doScript('inj', tabId, () => console.log('Loaded Local Library App'));
  // doScript('dbg', tabId, () => console.log('Loaded Debugger Script'));
});
