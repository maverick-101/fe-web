import React from 'react';
import style from './style.css';
//import _ from 'lodash';


export default class GMap extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      mapInitialized: false
    };

    this.map = null;
    this.initMap = this.initMap.bind(this);
  }

  initMap(id) {
    let bounds = new google.maps.LatLngBounds();
    let markers = this.props.markers;
    let maxZoom = 17;
    let mapOptions = {
      mapTypeId: 'roadmap',
      zoom: 12
    };
    const that = this;
    // Display a map on the page
    this.map = new google.maps.Map(this.refs[id], mapOptions);
    //this.map.setTilt(45);

    // Info Window Content
    /*let infoWindowContent = [
      ['<div class="info_content">' +
      '<h3>London Eye</h3>' +
      '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' + '</div>'],
      ['<div class="info_content">' +
      '<h3>Palace of Westminster</h3>' +
      '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
      '</div>']
    ];*/

    // Display multiple markers on a map
    let marker, i;
    // Loop through our array of markers & place each one on the map
    for (i = 0; i < markers.length; i++) {
      let infoWindow = new google.maps.InfoWindow();
      let position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(position);
      marker = new google.maps.Marker({
        position: position,
        map: this.map,
        title: markers[i].title
      });

      // Allow each marker to have an info window
      google.maps.event.addListener(marker, 'click', (function (marker) {
        return function () {
          infoWindow.setContent(marker.title);
          infoWindow.open(this.map, marker);
        }
      })(marker, i));
      infoWindow.setContent(marker.title);
      infoWindow.open(this.map, marker);
    }
    // Automatically center the map fitting all markers on the screen
    this.map.fitBounds(bounds);

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    let boundsListener = google.maps.event.addListener(this.map, 'idle', function (event) {
      //console.log(`#### ${id}`, this.getZoom());
      that.map.setZoom(that.map.getZoom() > maxZoom ? maxZoom : that.map.getZoom() - 1);
      google.maps.event.removeListener(boundsListener);
    });

    this.setState({mapInitialized: true});
  }

  componentDidMount() {
    if (!this.props.id) return null;
    if (!this.state.mapInitialized && this.props.googleMapLoaded) {
      this.initMap(`map_${this.props.id}`);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.id) return null;
    if (!this.state.mapInitialized && nextProps.googleMapLoaded) {
      this.initMap(`map_${this.props.id}`);
    }/* else if (this.state.mapInitialized && nextProps.googleMapLoaded) {
      let bounds = new google.maps.LatLngBounds();
      let markers = nextProps.markers;
      for (let i = 0; i < markers.length; i++) {
        let position = new google.maps.LatLng(markers[i].lat, markers[i].lng);
        bounds.extend(position);
      }
      this.map.fitBounds(bounds);
      if (this.map.getZoom() > 17) {
        this.map.setZoom(17)
      }
    }*/
  }

  render() {
    if (!this.props.id) return null;
    return (
      <div className={style.mapCanvas} ref={`map_${this.props.id}`}/>
    )
  }
}
