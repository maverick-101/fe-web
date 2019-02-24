import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'
import placeholder from 'no-image.jpg'

class Tile extends React.Component {
  render() {
    return (
      <a>
      <div style={{width:'100%'}} className='space-4  text-left inline-block'>
        <div className={`${style.recommendedPackagesTile}`}>
          <div className={`bgDiv ${style.recommendedPackagesImg}`} style={{background:`url(${this.props.data.gallery.length ? this.props.data.gallery[0].url : placeholder})` }}/>
          <div className={style.recommendedPackagesText}>
            <div className='col-sm-12 no-padding'>
            <h5 style={{minWidth: '200px', marginBottom: '6px'}}>{this.props.data.name}</h5>
              <p style={{marginBottom: '6px'}}>{this.props.data.reviews}</p>
            </div>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile