// Backup only - currently not used as I moved it to the injected bundle

const pclnDebugger = () => {
  if (process.env.NODE_ENV === 'production') {
    chrome.tabs.executeScript({ file: '/js/dbg.bundle.js', runAt: 'document_end' });
  } else {
    fetch('http://localhost:3000/js/dbg.bundle.js')
      .then(res => res.text())
      .then((fetchRes) => {
        chrome.tabs.executeScript({ code: fetchRes, runAt: 'document_end' });
      });
  }
};

export default pclnDebugger;
