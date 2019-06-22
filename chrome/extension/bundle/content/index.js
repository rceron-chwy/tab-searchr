// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // If the received message has the expected format...
  if (msg.method === 'read_html') {
    console.log('LISTENER', msg);
    // Call the specified callback, passing
    // the web-page's DOM content as argument
    sendResponse(document.all[0].textContent);
  }
});
