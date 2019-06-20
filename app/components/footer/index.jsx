import React from 'react';
import PropTypes from 'prop-types';

import style from './styles.css';

const Footer = () => (
  <footer className={style.footer} >
    <div className={style.author}>rafaelceron.com</div>
    <div className={style.version}>v0.1.0</div>
  </footer>
);

Footer.propTypes = {
  title: PropTypes.string.isRequired
};

export default Footer;
