import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'

class Tile extends React.Component {
  render() {
    return (
      <div className='col-sm-3 space-4'>
        <div className={`${style.guidePackagesTile}`}>
          <div className={`bgDiv ${style.guidePackagesImg}`} style={{background:`url(${this.props.data.url})` }}>
          </div>
          <div className={style.guidePackagesText}>
            <div className='col-sm-12 no-padding'>
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
