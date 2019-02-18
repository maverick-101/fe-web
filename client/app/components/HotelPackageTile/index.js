import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';

import style from './style.css'

class Tile extends React.Component {
  render() {
    return (
      <div className='col-sm-4 space-4 inline-block'>
        <div className={`${style.hotelPackagesTile}`}>
          <div className={`${style.bgDiv} ${style.guidePackagesImg}`} style={{background:`url(${this.props.data.url})` }}>
          </div>
          {/* <p className={style.tileText}>{this.props.data.name}</p> */}
          <div className={style.hotelPackagesText}>
            <div className='col-sm-7 col-xs-7 col-md-7'>
              <h5 className='ellipses' style={{marginBottom: '6px'}}>{this.props.data.name}</h5>
              <p className='ellipses' style={{marginBottom: '6px', fontWeight: '200', fontSize: '14px'}}>Starting Price <span style={{color: '#e3530d'}}>Rs.{this.props.data.price || 'N/A'}</span></p>
            </div>
              <button style={{backgroundColor: '#00b3b3', color: 'white', border: 'none', marginTop: '5px'}} className="ellipses btn btn-lg btn-primary">Book Now</button>
          </div>
        </div>
      </div>
    )
  }
}

export default Tile
