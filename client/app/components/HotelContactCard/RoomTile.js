import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';
import placeholder from 'no-image.jpg';

import style from './style.css'


class Tile extends React.Component {
  render() {
    var { room, selectedId } = this.props;
    return (  
      // <a href={`/hotel/${this.props.data.ID}`}>
      <div className='row text-left space-4'>
      <div className={`col-sm-12`}>
        <div className={`col-sm-12 no-padding ${style.roomTile} ${selectedId == room.ID ? style.roomTileActive : ''}`}>
        <div className='col-sm-6 no-padding'>
          <h5 className={`${style.roomPrice}`} >Rs. {room.price_per_night || 'N/A'}</h5>
          <div className={`bgDiv ${style.roomTileImage}`} style={{height: '125px', background: `url(${this.props.image || placeholder})`}}></div>
        </div>
        <div className='col-sm-6'>
          <h3 className='ellipses'>{room.title}</h3>
          <p className='ellipses'><b>Bed Type : </b> {room.bed_type} </p>
          <p  className='ellipses'><b>Beds : </b> {room.beds} </p>
        </div>
        </div>
        </div>
      </div>
      //  </a>
    )
  }
}

  export default Tile
