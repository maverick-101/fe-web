import React from 'react'
import { connect } from 'react-redux'
import placeholder from 'no-image.jpg'
import { convertPrice } from 'helpers'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';

import style from './style.css'

class Tile extends React.Component {
  render() {
    return (
      <a href={`/package/${this.props.data.ID}`}>
      <div style={{width:'100%'}} className='space-4 inline-block'>
        <div className={`${style.guidePackagesTile}`}>
          <div className={`bgDiv ${style.guidePackagesImg}`} style={{background:`url(${this.props.data.gallery.length ? this.props.data.gallery[0].url : placeholder })` }}>
          </div>
          <div style={{position: 'relative'}}>
            <p className={`ellipses ${style.tileText}`}>{this.props.data.name}</p>
          </div>
          <div className={`clearfix ${style.guidePackagesText}`}>
              <h4 className='ellipses text-left' style={{marginBottom: '4px'}}>{this.props.data.package_title}</h4>
            <div className='col-sm-7 no-padding-left text-left col-xs-7 col-md-7'>
              <p style={{marginBottom: '0px', fontWeight: '200', fontSize: '12px'}}>Starting Price</p>
              <h5 style={{color: '#e3530d', marginTop:'0px'}}>{this.props.data.minimum_price ? `Rs.${convertPrice(this.props.data.minimum_price, 'PKR')}` : 'N/A'}</h5>
            </div>
              <button style={{backgroundColor: '#00b3b3', color: 'white', fontSize:'14px', border: 'none'}} className="btn col-xs-5 col-sm-5 col-md-5 btn-lg btn-primary">Book Now</button>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile
