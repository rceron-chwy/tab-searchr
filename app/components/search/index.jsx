import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import style from './styles.css';

class Search extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);
    this.addListener();
  }

  addListener() {
    chrome.runtime.onMessage.addListener(
      (message, sender, sendResponse) => {
        console.log('MESSAGE', message);
        if (message.method === 'getText') {
          sendResponse({ data: document.all[0].innerText, method: 'getText' }); //same as innerText
        }
      });
    console.log(this);
  }

  searchHandler() {
    chrome.tabs.query({ active: true, currentWindow: false }, (tabs) => {
      console.log(tabs, this);

      tabs.forEach((t) => {
        console.log(t.id, t);

        chrome.tabs.sendMessage(t.id, { method: 'getText' }, {}, response => console.log(response));
        // chrome.tabs.sendRequest(t.id, { method: 'getText' }, (response) => {
        //   if (response.method === 'getText') {
        //     console.log(response.data);
        //   }
        // });
      });
    });
  }

  renderSearchField() {
    return (
      <div className={style.searchBar}>
        <input
          type="text"
          className={style.searchField}
          placeholder="kubernetes..."
        />
        <button onClick={this.searchHandler}>Search</button>
      </div>
    );
  }

  render() {
    return (
      <div className={style.search}>
        {this.renderSearchField()}
      </div>
    );
  }
}

export default Search;
