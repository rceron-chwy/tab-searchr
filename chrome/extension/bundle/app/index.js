import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import Root from '../../../../app/containers/Root';

if (process.env.NODE_ENV === 'development') {
  debug.enable('rfc.*');
}

const createStore = require('../../../../app/redux/store/configure-store');

ReactDOM.render(
  <Root store={createStore({})} />,
  document.querySelector('#root')
);
