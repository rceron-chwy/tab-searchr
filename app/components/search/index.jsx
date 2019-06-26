/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import uniqBy from 'lodash/uniqBy';

import style from './styles.css';

const INITIAL_STATE = {
  q: '',
  results: null,
  view: 'S',
  cursor: -1
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
    this.handleBack = this.handleBack.bind(this);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.input.current.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  constructRegex = () => {
    const q = this.state.q;
    const terms = q.split(/\s+/).join('.');
    const regex = new RegExp(terms, 'ig');
    return regex;
  }

  handleKeyDown = (e) => {
    if (this.state.view === 'S') {
      if (e.key === 'Enter') this.handleSearch();
    } else {
      const { cursor, results } = this.state;

      if (e.key === 'Backspace') {
        this.handleBack();
        e.preventDefault();
      } else if (e.key === 'Enter' && cursor >= 0 && cursor < results.length - 1) {
        const result = results[cursor];
        this.handleTabSelect(result);
      } else if (e.key === 'ArrowUp' && cursor >= 0) {
        this.setState(prevState => ({ cursor: prevState.cursor - 1 }));
      } else if (e.key === 'ArrowDown' && cursor < results.length - 1) {
        this.setState(prevState => ({ cursor: prevState.cursor + 1 }));
      }
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
            this.setState({
              results: uniqBy(nextResults, 'id'),
              view: 'R'
            });
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

  handleBack() {
    this.setState({
      results: null,
      view: 'S',
      cursor: -1
    }, () => {
      this.input.current.focus();
    });
  }

  renderResults() {
    const { q, results, cursor } = this.state;

    const links = results.map((result, i) => {
      const className = cursor === i
        ? `${style.activeItem}`
        : null;

      return (
        <li
          key={result.id}
          className={className}
          onMouseEnter={() => this.setState({ cursor: i })}
        >
          <a href={result.url} alt={result.title} onClick={() => this.handleTabSelect(result)}>{result.title}</a>
        </li>
      );
    });

    return (
      <div className={style.results}>
        <div className={style.header}>
          <span className={style.info}>Displaying results for: &quot;{q}&quot;</span>
          <span className={style.back} onClick={this.handleBack}>Go Back</span>
        </div>
        <div className={style.items}>
          <ol>{links}</ol>
        </div>
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
    const { view } = this.state;
    return (
      <div className={style.searchWrapper}>
        {view === 'S' && this.renderSearchField()}
        {view === 'R' && this.renderResults()}
      </div>
    );
  }
}

export default Search;
