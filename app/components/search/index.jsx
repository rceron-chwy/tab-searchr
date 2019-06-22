/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';

import style from './styles.css';

const INITIAL_STATE = {
  q: '',
  results: null
};

const queries = [
  { active: true, currentWindow: true },
  { active: false, currentWindow: true },
  { active: true, currentWindow: false },
  { active: false, currentWindow: false }
];

class Search extends Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.input = React.createRef();

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleReset = this.handleReset.bind(this);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    window.addEventListener('keypress', this.handleKeyPress);
    this.input.current.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('keypress', this.handleKeyPress);
  }

  constructRegex = () => {
    const q = this.state.q;
    const terms = q.split(/\s+/).join('.');
    const regex = new RegExp(terms, 'ig');
    return regex;
  }

  handleKeyPress = (e) => {
    const key = e.which || e.keyCode;
    if (key === 13) {
      this.handleSearch();
    }
  }

  handleSearch() {
    const { results } = this.state;
    const $results = [];
    const regex = this.constructRegex();

    queries.forEach((query) => {
      chrome.tabs.query(query, (tabs) => {
        tabs.forEach((t) => {
          $results.push(new Promise((resolve) => {
            chrome.tabs.executeScript(t.id, {
              code: 'document.body.outerText'
            }, (response) => {
              if (response && response[0] && response[0].search(regex) > 0) {
                resolve({ id: t.id, matches: true, url: t.url, windowId: t.windowId, title: t.title });
              } else {
                resolve({ id: t.id, matches: false });
              }
            });
          }));
        });
        Promise
          .all($results)
          .then((values) => {
            const matches = values.filter(v => v.matches);
            const nextResults = Array.prototype.concat([], results || [], matches);
            this.setState({ results: nextResults });
          });
      });
    });
  }

  handleQueryChange(event) {
    this.setState({ q: event.target.value });
  }

  handleTabSelect(result) {
    chrome.windows.update(result.windowId, { focused: true });
    chrome.tabs.update(result.id, { active: true, highlighted: true });
  }

  handleReset() {
    this.setState(INITIAL_STATE);
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
        <div className={style.info}>Displaying results for: &quot;{q}&quot;</div>
        <div className={style.back} onClick={this.handleReset}>Back</div>
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
          ref={this.input}
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
