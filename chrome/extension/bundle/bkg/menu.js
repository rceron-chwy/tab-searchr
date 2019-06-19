// let windowId = 0;
// const CONTEXT_MENU_ID = 'priceline_debugger_context_menu';
//
// const closeIfExist = () => {
//   if (windowId > 0) {
//     chrome.windows.remove(windowId);
//     windowId = chrome.windows.WINDOW_ID_NONE;
//   }
// };
//
// const popWindow = (type) => {
//   closeIfExist();
//   const options = {
//     type: 'popup',
//     left: 100,
//     top: 100,
//     width: 800,
//     height: 475,
//   };
//
//   if (type === 'open') {
//     options.url = 'window.html';
//     chrome.windows.create(options, (win) => {
//       windowId = win.id;
//     });
//   }
// };
//
// chrome.contextMenus.create({
//   id: CONTEXT_MENU_ID,
//   title: 'Priceline Debugger',
//   contexts: ['all'],
//   documentUrlPatterns: [
//     'https://*.priceline.com/*'
//   ]
// });
//
// chrome.contextMenus.onClicked.addListener((event) => {
//   if (event.menuItemId === CONTEXT_MENU_ID) popWindow('open');
// });
