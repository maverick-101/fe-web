import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';

import style from './style.css'


class Tile extends React.Component {
  render() {
    return (
      <a href="/hotel/1">
        <div style={{background: `url(${this.props.data.url})`}} className={`col-sm-4 ${style.featuredTile} ${style.bgDiv}`}>
          <div className={`${style.featuredTilePriceDiv}`}>
            <p className={'no-padding no-margin'}>
            <p style={{fontSize:'11px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>RS</p>
            {this.props.data.min_price}+ 
              <p style={{fontSize:'12px', color:'white', display: 'inline-block'}} className={'no-padding no-margin'}>/Night</p>
            </p>
          </div>
        </div>
      </a>
    )
  }
}

  export default Tile
