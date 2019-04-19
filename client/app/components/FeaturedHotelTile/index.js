import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';
import placeholder from 'no-image.jpg';
import { imgUpload, convertPrice } from 'helpers';


import style from './style.css'


class Tile extends React.Component {
  render() {
    return (  
      <a href={`/hotel/${this.props.data.ID}`}>
      <div style={{width: this.props.width}} className='inline-block text-left space-4'>
        <div style={{background: `url(${this.props.data.gallery.length ? imgUpload(this.props.data.gallery[0].url, 'h_400') : placeholder})`}} className={`${style.featuredTile} ${style.bgDiv}`}>
          <div className={`${style.featuredTilePriceDiv}`}>
            <p className={'no-padding no-margin'}>
            <p style={{fontSize:'11px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS.</p>
            {convertPrice(this.props.data.minimum_price, 'PKR')}+ 
              <p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>/Night</p>
            </p>
          </div>
        </div>
        </div>
       </a>
    )
  }
}

  export default Tile
