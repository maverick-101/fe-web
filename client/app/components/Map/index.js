import React from 'react';
import style from './style.css';


export default class GMap extends React.Component {
  render() {
    return (
      <div className={style.mapCanvas} ref="map"></div>
    )
  }
  componentDidMount() {
    this.map = new google.maps.Map(this.refs.map, {
      zoom: 10,
      center: {lat: 33.5059936, lng: 73.0786943},
      scrollwheel: false,
    })
    this.directionsService = new google.maps.DirectionsService;

    this.directionsService.route({
      origin: {lat: 33.5059936, lng: 73.0786943},
      destination: 'Rawalpindi Airport',
      travelMode: 'DRIVING',
    }, directions => {
      this.direction1 = new google.maps.DirectionsRenderer({
        directions,
        map: this.map,
        polylineOptions: {
          strokeColor: "#ee534f",
          strokeWeight: 5,
          fillColor: '#ffffff'
        }
      })
    })

    this.directionsService.route({
      origin: {lat: 33.5059936, lng: 73.0786943},
      destination: 'Saddar Rawalpindi',
      travelMode: 'DRIVING',
    }, directions => {
      this.direction2 = new google.maps.DirectionsRenderer({
        directions,
        map: this.map,
        polylineOptions: {
          strokeColor: "#25a499",
          strokeWeight: 5,
          fillColor: '#ffffff'
        }
      })
    })
  }
}
