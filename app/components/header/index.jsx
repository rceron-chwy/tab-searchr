import React from 'react';
import PropTypes from 'prop-types';

import style from './styles.css';

const Header = ({ title }) => (
  <header className={style.header} >
    {title}
  </header>
);

Header.propTypes = {
  title: PropTypes.string.isRequired
};

export default Header;
