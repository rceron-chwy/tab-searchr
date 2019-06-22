/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

import style from './styles.css';

class Search extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);

    this.state = {
      q: '',
      results: null
    };
    // this.addListener();
  }

  // addListener() {
  //   chrome.runtime.onMessage.addListener(
  //     (message, sender, sendResponse) => {
  //       console.log('MESSAGE', message);
  //       if (message.method === 'getText') {
  //         sendResponse({ data: document.all[0].innerText, method: 'getText' }); //same as innerText
  //       }
  //     });
  //   console.log(this);
  // }

  // console.log("Query terms: ", this.state.q);
  // chrome.tabs.executeScript({
  //   code: 'var content = document.body.textContent; content'
  // }, (response) => {
  //   // const containsQuery = (response && response.search(this.state.q) > 0) || false;
  //   // console.log(t.url, containsQuery, response);
  //   console.log(response);
  // });

  handleSearch() {
    const results = [];
    chrome.tabs.query({ active: false, currentWindow: false }, (tabs) => {
      tabs.forEach((t) => {
        // chrome.tabs.sendMessage(t.id, { method: 'read_html' }, response => console.log(t.url, response));

        results.push(new Promise((resolve) => {
          chrome.tabs.executeScript(t.id, {
            code: 'document.body.textContent'
          }, (response) => {
            const containsQuery = (response && response[0] && response[0].search(this.state.q) > 0) || false;
            if (containsQuery) {
              const oneResult = { id: t.id, matches: true, url: t.url, windowId: t.windowId, title: t.title };
              resolve(oneResult);
            }
            resolve({ id: t.id, matches: false });
          });
        }));
      });

      Promise.all(results)
      .then((values) => {
        this.setState({ results: values.filter(v => v.matches) });
      });
    });
  }

  handleQueryChange(event) {
    this.setState({ q: event.target.value });
  }

  handleTabSelect(result) {
    chrome.windows.update(result.windowId, { focused: true }, () => {
      chrome.tabs.update(result.id, { active: true });
    });
  }

  renderResults() {
    const { q, results } = this.state;

    const links = results.map((result) => {
      return (
        <li key={result.id} className={style.resultItem}>
          <a href={result.url} alt={result.title} onClick={() => this.handleTabSelect(result)}>{result.title}</a>
        </li>
      );
    });

    return (
      <div className={style.results}>
        <div className={style.info}> Displaying results for: &quot;{q}&quot;</div>
        <ol>
          {links}
        </ol>
      </div>
    );
  }

  renderSearchField() {
    return (
      <div className={style.searchBar}>
        <input
          type="text"
          className={style.searchField}
          placeholder="kubernetes..."
          value={this.state.q}
          onChange={this.handleQueryChange}
        />
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }

  render() {
    const { results } = this.state;
    return (
      <div className={style.searchWrapper}>
        {!results && this.renderSearchField()}
        {results && this.renderResults()}
      </div>
    );
  }
}

export default Search;
