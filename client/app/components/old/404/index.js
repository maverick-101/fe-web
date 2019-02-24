import React from 'react';

import style from './style.css';

export default function(props) {
  return (
    <div className={style.container}>
      <div className={style.centerContent}>
        <h2>PAGE NOT FOUND!</h2>
        <p className="large">The page you are looking for cannot be found. Goto home by <a href="/" className="red">clicking here</a>.</p>
      </div>
    </div>
  )
}
