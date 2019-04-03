import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import { convertPrice, imgUpload } from 'helpers'
import placeholder from 'no-image.jpg'


import style from './style.css'

class Tile extends React.Component {
  render() {
    return (
      <a href={`/hotel/${this.props.data.id}`}>
      <div className='space-4 text-left'> 
        <div className={`${style.hotelPackagesTile}`}>
          <div className={`bgDiv ${style.guidePackagesImg}`} style={{background:`url(${imgUpload(this.props.data.url, 'h_400') || placeholder})` }}>
          </div>
          {/* <p className={style.tileText}>{this.props.data.name}</p> */}
          <div className={`clearfix ${style.hotelPackagesText}`}>
            <h4 className='ellipses' style={{marginBottom: '4px'}}>{this.props.data.name}</h4>
            <div style={{marginTop: '3px'}} className='col-sm-7 no-padding col-xs-7 col-md-7'>
              <p className='ellipses' style={{marginBottom: '0px', fontWeight: '200', fontSize: '12px'}}>Starting Price</p>
              <h5 style={{color: '#e3530d', marginTop:'0px'}}>Rs.{convertPrice(this.props.data.minimum_price, 'PKR') || 'N/A'}</h5>
            </div>
              <button style={{backgroundColor: '#00b3b3', color: 'white', border: 'none', fontSize: '14px'}} className="col-sm-5 col-xs-5 ellipses btn btn-lg btn-primary">Book Now</button>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile
