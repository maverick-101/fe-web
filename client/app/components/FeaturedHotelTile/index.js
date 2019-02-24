import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';

import style from './style.css'


class Tile extends React.Component {
  render() {
    return (  
      <a href={`/hotel/${this.props.data.ID}`}>
      <div style={{width: this.props.width}} className='inline-block text-left space-4'>
        <div style={{background: `url(${this.props.data.gallery.length ? this.props.data.gallery[0].url : placeholder})`}} className={`${style.featuredTile} ${style.bgDiv}`}>
          <div className={`${style.featuredTilePriceDiv}`}>
            <p className={'no-padding no-margin'}>
            <p style={{fontSize:'11px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS</p>
            {this.props.data.min_price}+ 
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
