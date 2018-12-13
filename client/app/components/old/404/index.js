import React from 'react';

import style from './style.css';

export default function(props) {
  return (
    <div className={style.container}>
      <div className={style.logo}>
        <a href="/">
          <svg>
            <use xlinkHref={`${require('logo.svg')}#logo`}></use>
          </svg>
        </a>
      </div>
      <div className={style.centerContent}>
        <img src={`${require('404.png')}`} width={500} alt="Error 404"/>
        <h2>PAGE NOT FOUND!</h2>
        <p className="large">The page you are looking for cannot be found. Goto home by <a href="/" className="red">clicking here</a>.</p>
      </div>
    </div>
  )
}
