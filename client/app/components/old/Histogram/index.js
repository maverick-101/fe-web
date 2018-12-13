import React from 'react';

import style from './style.css';

export default class Histogram extends React.Component {
    render() {
    // var values = [8, 3, 1, 18, 30, 145, 400, 1171, 1673, 1990, 3113, 3495, 3434, 3017, 3324, 3335, 1951, 2467, 3126, 1130, 1689, 2563, 387, 819, 1189, 438, 332, 697, 193, 398, 169, 332, 100, 174, 67, 243, 89, 38, 137, 19, 57, 63, 48, 69, 4, 52, 35, 20, 377];
    var values = this.props.data.data;
    var max = Math.max(...values);
    return (
      <div className={style.histogram}>
        {values.map((val, index) => <div key={index} className={style.bar} style={{height: Math.ceil(val/max * 64)}}/>)}
      </div>
    )
  }
}
