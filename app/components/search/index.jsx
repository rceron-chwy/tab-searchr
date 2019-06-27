/* eslint-disable jsx-a11y/img-has-alt */
/* eslint-disable max-len */
/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import uniqBy from 'lodash/uniqBy';
import debug from 'debug';

import style from './styles.css';

const log = debug('rfc.search.index');

const INITIAL_STATE = {
  q: '',
  results: null,
  view: 'S',
  cursor: 0
};

const queries = [
  { active: true, currentWindow: true },
  { active: false, currentWindow: true },
  { active: true, currentWindow: false },
  { active: false, currentWindow: false }
];

class Search extends Component {

  constructor(props) {
    super(props);

    this.inputRef = React.createRef();
    this.itemRefs = new Map();

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleReloadTabs = this.handleReloadTabs.bind(this);
    this.scrollIntoView = this.scrollIntoView.bind(this);

    this.state = INITIAL_STATE;
  }

  componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    this.inputRef.current.focus();
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  constructRegex = () => {
    const terms = this.state.q.split(/\s+/).join('.');
    return new RegExp(terms, 'ig');
  }

  handleKeyDown = (e) => {
    if (e.key === 'Escape') window.close();
    if (this.state.view === 'S') {
      if (e.key === 'Enter') this.handleSearch();
    } else {
      const { cursor, results } = this.state;

      if (e.key === 'Backspace') {
        this.handleBack();
        e.preventDefault();
      } else if (e.key === 'Enter' && cursor >= 0 && cursor <= results.length - 1) {
        this.handleTabSelect(results[cursor]);
      } else if (e.key === 'ArrowUp' && cursor > 0) {
        this.setState(prevState => ({ cursor: prevState.cursor - 1 }));
        this.scrollIntoView();
      } else if (e.key === 'ArrowDown' && cursor < results.length - 1) {
        this.setState(prevState => ({ cursor: prevState.cursor + 1 }));
        this.scrollIntoView();
      }
    }
  }

  scrollIntoView() {
    const { cursor } = this.state;
    const node = this.itemRefs.get(cursor);
    if (node) {
      // eslint-disable-next-line react/no-find-dom-node
      ReactDOM.findDOMNode(node).scrollIntoView({
        block: 'end',
        behavior: 'smooth'
      });
    }
  }

  handleReloadTabs() {
    queries.forEach((query) => {
      chrome.tabs.query(query, (tabs) => {
        tabs.forEach((t) => {
          chrome.tabs.reload(t.id);
        });
      });
    });
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
                resolve({ matches: true, ...t });
              } else {
                resolve({ matches: false, ...t });
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
    log('handleTabSelect:', result);
    const { id, windowId, discarded } = result;

    chrome.windows.update(windowId, { focused: true });
    chrome.tabs.update(id, { active: true, highlighted: true });
    chrome.tabs.highlight({ windowId, tabs: [id] });

    if (discarded) {
      log('handleTabSelect: ', 'reloading inactive tab');
      chrome.tabs.reload(id);
    }
    // window.close();
  }

  handleBack() {
    this.setState({ results: null, view: 'S', cursor: -1 }, () => {
      this.inputRef.current.focus();
    });
  }

  renderResults() {
    const { q, results, cursor } = this.state;

    const links = results.map((result, i) => {
      const active = cursor === i;
      const className = active ? `${style.activeItem}` : null;

      return (
        <li
          ref={element => this.itemRefs.set(i, element)}
          key={result.id}
          className={className}
          onMouseEnter={() => this.setState({ cursor: i })}
        >
          <img className={style.favIconUrl} src={result.favIconUrl} />
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
      <div>
        <div className={style.searchBar}>
          <input
            ref={this.inputRef}
            type="text"
            className={style.searchField}
            placeholder="just type something..."
            value={this.state.q}
            onChange={this.handleQueryChange}
          />
        </div>
        <div className={style.actionsBar}>
          <button onClick={this.handleSearch}>Search</button>
          <button onClick={this.handleReloadTabs}>Reload Tabs</button>
        </div>
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
