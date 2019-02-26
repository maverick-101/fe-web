import React from 'react'
import { connect } from 'react-redux'
import placeholder from 'no-image.jpg'
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
          <div className={style.guidePackagesText}>
            <div className='col-sm-7 no-padding-left text-left col-xs-7 col-md-7'>
              <h4 className='ellipses' style={{marginBottom: '6px'}}>{this.props.data.package_title}</h4>
              <p style={{marginBottom: '6px', fontWeight: '200', fontSize: '14px'}}>Starting Price <span style={{color: '#e3530d'}}>Rs.{3000}</span></p>
            </div>
              <button style={{backgroundColor: '#00b3b3', color: 'white', fontSize:'14px', border: 'none', marginTop: '5px'}} className="btn col-xs-5 col-sm-5 col-md-5 btn-lg btn-primary">Book Now</button>
          </div>
        </div>
      </div>
      </a>
    )
  }
}

export default Tile
