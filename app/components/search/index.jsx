import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import style from './styles.css';

class Search extends Component {
  static propTypes = {
  };

  static renderSearchField() {
    return (
      <div className={style.searchBar}>
        <input
          type="text"
          className={style.searchField}
          placeholder="kubernetes..."
          value=""
        />
      </div>
    );
  }

  render() {
    return (
      <div className={style.search}>
        {Search.renderSearchField()}
      </div>
    );
  }
}

export default Search;
