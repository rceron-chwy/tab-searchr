import React from 'react';
import packageJson from '../../../package.json';

import style from './styles.css';

const Footer = () => (
  <footer className={style.footer} >
    <div className={style.author}>rafaelceron.com</div>
    <div className={style.version}>v{packageJson.version}</div>
  </footer>
);

export default Footer;
