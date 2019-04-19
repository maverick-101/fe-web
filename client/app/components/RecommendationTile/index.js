import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'
import placeholder from 'no-image.jpg'
import {imgUpload} from '../../helpers'

class Tile extends React.Component {
  render() {
    return (
      <a href={`/location/${this.props.data.ID}`}>
      <div style={{width:'100%'}} className='space-4  text-left inline-block'>
        <div className={`${style.recommendedPackagesTile}`}>
          <div className={`bgDiv ${style.recommendedPackagesImg}`} style={{background:`url(${this.props.data.gallery.length ? imgUpload(this.props.data.gallery[0].url, 'h_400') : placeholder})` }}/>
          <div className={style.recommendedPackagesText}>
            <div className='col-sm-12 no-padding'>
              <p className='orange ellipses' style={{minWidth: '200px', fontSize:'14px', marginBottom: '0px'}}>{`${this.props.data.city ? `${this.props.data.city.name}, ${this.props.data.city.province}` : ''}`}</p>
              <p style={{marginBottom: '0px'}}>{this.props.data.reviews}</p>
              <h4 className='no-margin ellipses' style={{minWidth: '200px', fontSize:'14px', marginBottom: '0px'}}>{this.props.data.name}</h4>
            </div>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile
