import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'

class Tile extends React.Component {
  render() {
    return (
      <div className='col-sm-3'>
        <div className={`${style.guidePackagesTile}`}>
          <div className={`${style.bgDiv} ${style.guidePackagesImg}`} style={{background:`url(${this.props.data.url})` }}>
          </div>
          <div className={style.guidePackagesText}>
            <div className='col-sm-12'>
            <h5 style={{marginBottom: '6px'}}>{this.props.data.name}</h5>
              <p style={{marginBottom: '6px'}}>{this.props.data.reviews}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile
