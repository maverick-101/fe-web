import React from 'react';
import style from './style.css';
import _ from 'lodash';

const SearchResultsListItem = function(props) {
  const { place, icon, selectMarker } = props;
  let ratingPercentage = (((place.rating || 0) / 5) * 100);
  return (
    <li data-marker_no="19" data-lat="33.5658619" data-lng="73.0464111" onClick={() => selectMarker(place)}>
      <img src={require('gmap-map.png')} className={`${style.left} ${style.icon} svg-restaurants`}/>
      <div className={`${style.left} ${style.locStats}`}>
        <div className="title">{place.name}</div>
        <div className={`${style.left} ${style.rating}`}>{place.rating || 'N/A'}</div>
        <div className={style.left}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -15 300 70" height="18"
               style={{ display: 'block' }}>
            {ratingPercentage && !!place.rating ?
              <defs>
                <linearGradient id={place.id} x1="0%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#03a38e"/>
                  <stop offset={ratingPercentage + '%'} stopColor="#03a38e"/>
                  <stop offset={ratingPercentage + '%'} stopColor="#ccc"/>
                  <stop offset="100%" stopColor="#ccc"/>
                </linearGradient>
              </defs> :
              <defs>
                <linearGradient id={place.id} x1="0%" y1="0%" y2="0%">
                  <stop offset="0%" stopColor="#03a38e"/>
                  <stop offset="0%" stopColor="#03a38e"/>
                  <stop offset="0%" stopColor="#fafafa"/>
                  <stop offset="100%" stopColor="#fafafa"/>
                </linearGradient>
              </defs>
            }
            <path fill={`url(#${place.id})`} stroke="#000" strokeWidth=".5"
                  d="M0 16.4h17.3L22.6 0 28 16.4h17.3l-14 10.2L36.6 43l-14-10.2L8.6 43 14 26.6 0 16.4zm49.5 0h17.3L72 0l5.5 16.4h17.3l-14 10.2L86 43 72 33 58 43l5.5-16.4-14-10.2zm49.5 0h17.3L121.6 0l5.3 16.4H144l-14 10.2 5.4 16.4-14-10.2-14 10.2 5.4-16.4-14-10.2zm49.5 0h17.3L171 0l5.4 16.4h17.3l-14 10.2L185 43l-14-10-14 10 5.4-16.4-14-10.2zm50 0h17.2L221.2 0l5.4 16.4h17.3l-14 10.2L235 43l-14-10.2L207 43l5.4-16.4-14-10.2z"/>
          </svg>
        </div>
      </div>
    </li>
  );
};

export default class GMapCommute extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      markers: [],
      mapInitialized: false,
      placesMode: 'commute',
      travelMode: 'DRIVING',
      places: []
    };

    this.map = null;
    this.infoWindow = null;
    this.bounds = null;
    this.center = null;
    this.centerMarker = null;
    this.directionsService = null;
    this.directionsDisplay = null;
    this.initMap = this.initMap.bind(this);
    this.clearMarkers = this.clearMarkers.bind(this);
    this.createMarkers = this.createMarkers.bind(this);
    this.initPlaces = this.initPlaces.bind(this);
    this.initListener = this.initListener.bind(this);
    this.selectMarker = this.selectMarker.bind(this);
  }

  selectMarker(place) {
    const that = this;
    let selectedMarker = _.find(this.state.markers, (marker) => marker.id === place.id);
    //console.log("####", place, selectedMarker);
    if (!!selectedMarker) {
      //this.map.panTo(selectedMarker.getPosition());
      this.infoWindow.setContent(place.name);
      this.infoWindow.open(this.map, selectedMarker);

      this.directionsService.route({
        origin: place.geometry.location,
        destination: this.center,
        travelMode: this.state.travelMode
      }, function(response, status) {
        if (status === 'OK') {
          //console.log("###", response);
          // Info Window Content
          let distance, duration;
          if (response.routes && response.routes[0].legs && response.routes[0].legs[0]) {
            let infoWindowContent = [
              ['<div class="info_content">' +
              '<div>[[[NAME]]]</div>' +
              '<div><small><strong>[[[MESSAGE]]]</strong></small></div>' +
              '</div>']
            ];
            infoWindowContent[0][0] = infoWindowContent[0][0].replace('[[[NAME]]]', place.name);
            distance = response.routes[0].legs[0].distance.text;
            duration = response.routes[0].legs[0].duration.text;
            infoWindowContent[0][0] = infoWindowContent[0][0].replace('[[[MESSAGE]]]', `${duration} ${that.state.travelMode} - ${distance}`);
            that.infoWindow.setContent(infoWindowContent[0][0]);
            that.infoWindow.open(that.map, selectedMarker);
          }
          //console.log("### message", duration, distance);
          that.directionsDisplay.setDirections(response);
        } else {
          console.log('Directions request failed due to ' + status);
        }
      });
    }
  }

  clearMarkers() {
    if (this.state.markers && this.state.markers.length) {
      const markers = this.state.markers;
      for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
      }
      this.setState({ markers: [] });
    }
  }

  createMarkers(results) {
    const that = this;
    let markers = [];
    this.initListener();
    this.bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < results.length; i++) {
      let place = results[i];
      const placeLoc = place.geometry.location;
      const marker = new google.maps.Marker({
        map: this.map,
        position: placeLoc,
        id: place.id
      });
      markers.push(marker);

      const position = new google.maps.LatLng(placeLoc.lat(), placeLoc.lng());
      this.bounds.extend(position);

      google.maps.event.addListener(marker, 'click', function() {
        that.infoWindow.setContent(place.name);
        that.infoWindow.open(that.map, this);
      });
    }

    this.map.fitBounds(this.bounds);
    //this.map.setCenter({lat:this.props.lat, lng:this.props.lng});
    this.setState({ markers });
  }

  initPlaces() {
    const that = this;
    const placesMode = this.state.placesMode;

    this.infoWindow.setContent(this.centerMarker.title);
    this.infoWindow.open(that.map, this.centerMarker);
    this.directionsDisplay.setDirections({ routes: [] });

    if (placesMode === 'commute') return false;
    let request = {
      location: this.center,
      radius: '5000',
      type: [placesMode]
    };

    function callback(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK && results.length) {
        that.setState({ places: results });
        that.createMarkers(results);
      }
    }

    const service = new google.maps.places.PlacesService(this.map);
    service.nearbySearch(request, callback);
  }

  initListener() {
    const that = this;
    const maxZoom = 17;
    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    let boundsListener = google.maps.event.addListener(this.map, 'idle', function(event) {
      //console.log(`####`, this.getZoom());
      if (that.map.getZoom() > maxZoom) {
        that.map.setZoom(maxZoom)
      }
      google.maps.event.removeListener(boundsListener);
    });
  }

  initMap(id) {
    if (!this.props.lat || !this.props.lng) {
      return false;
    }

    const that = this;
    //const markers = this.props.markers;
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer({
      markerOptions: {
        zIndex: 99999
      }
    });
    this.center = new google.maps.LatLng(this.props.lat, this.props.lng);
    const mapOptions = {
      center: this.center,
      mapTypeId: 'roadmap',
      zoom: 12
    };

    // Display a map on the page
    this.map = new google.maps.Map(this.refs[id], mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    this.bounds = new google.maps.LatLngBounds();
    //this.map.setTilt(45);

    // Display center marker on map
    this.centerMarker = new google.maps.Marker({
      position: this.center,
      map: this.map,
      title: this.props.title || 'Area Location'
    });

    // Allow each marker to have an info window
    google.maps.event.addListener(this.centerMarker, 'click', (function(centerMarker) {
      return function() {
        that.infoWindow.setContent(centerMarker.title);
        that.infoWindow.open(that.map, centerMarker);
      }
    })(this.centerMarker));

    this.directionsDisplay.setMap(this.map);

    this.initListener();
    this.bounds.extend(this.center);
    // Automatically center the map fitting all markers on the screen
    this.map.fitBounds(this.bounds);

    // Initializing Autocomplete
    const options = {
      bounds: this.bounds,
      //types: ['geocode']
    };

    const autocomplete = new google.maps.places.Autocomplete(this.refs[id + '_places_search'], options);

    function fillInAddress() {
      // Get the place details from the autocomplete object.
      let place = autocomplete.getPlace();

      //console.log("######", place);
      if (place && place.geometry.location) {
        that.clearMarkers();
        that.createMarkers([place]);
        that.selectMarker(place);
      }
    }

    autocomplete.addListener('place_changed', fillInAddress);

    this.initPlaces();
    this.setState({ mapInitialized: true });
  }

  componentDidMount() {
    if (!this.props.id) return null;
    if (!this.state.mapInitialized && this.props.googleMapLoaded) {
      this.initMap(`map_${this.props.id}`);
    }
  }

  changePlacesMode(mode) {
    if (this.state.mapInitialized && this.props.googleMapLoaded && this.state.placesMode !== mode) {
      this.setState({ places: [] });
      this.clearMarkers();
      this.setState({ placesMode: mode }, () => {
        this.initPlaces();
      });
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.id) return null;
    const map = `map_${this.props.id}`;
    if (!this.state.mapInitialized && nextProps.googleMapLoaded) {
      this.initMap(map);
    }
  }

  render() {
    if (!this.props.id) return null;
    return (
      <div className={style.mapIframe} style={{ position: 'relative', }}>
        <div className={`row`}>
          <div className={`col-sm-5 col-xs-12 ${style.mapCommuteR}`}>
            <ul className={style.locations}>
              <li
                className={`${style.commute} ${this.state.placesMode === 'commute' ? style.active : ''} has-child panels-toggles`}
                onClick={() => this.changePlacesMode('commute')}>
                <div className={style.basic}>
                  <img src={require('clock.png')} className={`${style.left} ${style.icon} svg-commute`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>Commute</div>
                    <span>Calculate commute distance &amp; time</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg>
                  <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-commute`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={`${style.detailed}  ${style.detail}`}>
                  <div className={style.tabHeading}>MODE OF TRAVEL</div>
                  <ul className={style.tabs} id="modesPanel">
                    <li className={`${style.left} ${this.state.travelMode === 'DRIVING' ? style.active : ''}`}
                        onClick={() => this.setState({ travelMode: 'DRIVING' })}>
                      <svg className={style.svgCar}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-car`}/>
                      </svg>
                      <svg className={style.svgCarDark}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-car-dark`}/>
                      </svg>
                    </li>
                    <li className={`${style.left} ${this.state.travelMode === 'TRANSIT' ? style.active : ''}`}
                        onClick={() => this.setState({ travelMode: 'TRANSIT' })}>
                      <svg className={style.svgBus}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-bus`}/>
                      </svg>
                      <svg className={style.svgBusDark}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-bus-dark`}/>
                      </svg>

                    </li>
                    <li className={`${style.left} ${this.state.travelMode === 'BICYCLING' ? style.active : ''}`}
                        onClick={() => this.setState({ travelMode: 'BICYCLING' })}>
                      <svg className={style.svgBicycle}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-bicycle`}/>
                      </svg>
                      <svg className={style.svgBicycleDark}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-bicycle-dark`}/>
                      </svg>

                    </li>
                    <li className={`${style.left} ${this.state.travelMode === 'WALKING' ? style.active : ''}`}
                        onClick={() => this.setState({ travelMode: 'WALKING' })}>
                      <svg className={style.svgWalk}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-walk`}/>
                      </svg>
                      <svg className={style.svgWalkDark}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-walk-dark`}/>
                      </svg>
                    </li>
                  </ul>
                  <div className={style.inputBox}>
                    <div className={style.lbl}>
                      <svg className={style.svgMap}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-map-view-dark`}/>
                      </svg>
                      DESTINATION
                    </div>

                    <input type="text" id="locationSearchInput" placeholder="Enter a location" autoComplete="off"
                           style={{ outline: 'none' }} ref={`map_${this.props.id}_places_search`}/>
                    <svg className={style.pacInputCross} id="pac-clear">
                      <use xmlnsXlink="http://www.w3.org/1999/xlink"
                           xlinkHref={`${require('desktop-common_01.svg')}#svg-cross-view`}/>
                    </svg>
                    <button className={style.ghostBtn} onClick={() => {/*searchPlacesMaker()*/
                    }}>
                      <svg className={style.svgSubmitArrow}>
                        <use xmlnsXlink="http://www.w3.org/1999/xlink"
                             xlinkHref={`${require('desktop-property-detail.svg')}#svg-right-arrow`}/>
                      </svg>
                    </button>
                  </div>
                  <div className={`${style.commuteWarning} dis-none`}/>
                  <ul className={`${style.searchResults} no-style`}>
                  </ul>
                </div>
              </li>
              <li
                className={`${style.mapListItem} ${this.state.placesMode === 'school' ? style.active : ''} schools panels-toggles`}
                onClick={() => this.changePlacesMode('school')}>
                <div className={style.basic}>
                  <img src={require('education.png')} className={`${style.left} ${style.icon} svg-school`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>EDUCATIONAL INSTITUTES</div>
                    <span className="summary">See educational institutes nearby</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                    xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg> */}
                  {/* <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                    xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-school`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={style.detailed}>
                  <ul className={`${style.placeSearchResult} custom-scroll`}>
                    {this.state.places && this.state.places.length && this.state.placesMode === 'school' ?
                      this.state.places.map((place, index) =>
                        <SearchResultsListItem
                          place={place}
                          icon="svg-school-pin"
                          key={index}
                          selectMarker={this.selectMarker}/>
                      ) : null
                    }
                  </ul>
                </div>
              </li>
              <li
                className={`${style.mapListItem} ${this.state.placesMode === 'hospital' ? style.active : ''} hospitals panels-toggles`}
                onClick={() => this.changePlacesMode('hospital')}>
                <div className={style.basic}>
                  <img src={require('doctor.png')} className={`${style.left} ${style.icon} svg-hospital`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>HOSPITALS / CLINICS</div>
                    <span className="summary">See hospitals and clinics nearby</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg>
                  <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-hospital`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={style.detailed}>
                  <ul className={`${style.placeSearchResult} custom-scroll`}>
                    {this.state.places && this.state.places.length && this.state.placesMode === 'hospital' ?
                      this.state.places.map((place, index) =>
                        <SearchResultsListItem
                          place={place}
                          icon="svg-hospital-pin"
                          key={index}
                          selectMarker={this.selectMarker}/>
                      ) : null
                    }
                  </ul>
                </div>
              </li>
              <li
                className={`${style.mapListItem} ${this.state.placesMode === 'restaurant' ? style.active : ''} restaurants panels-toggles`}
                onClick={() => this.changePlacesMode('restaurant')}>
                <div className={style.basic}>
                  <img src={require('cafe-restaurant.png')} className={`${style.left} ${style.icon} svg-restaurants`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>RESTAURANTS / CAFÉS</div>
                    <span className="summary">See restaurants and cafes nearby</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg>
                  <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-restaurants`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={style.detailed}>
                  <ul className={`${style.placeSearchResult} custom-scroll`}>
                    {this.state.places && this.state.places.length && this.state.placesMode === 'restaurant' ?
                      this.state.places.map((place, index) =>
                        <SearchResultsListItem
                          place={place}
                          icon="svg-restaurants-pin"
                          key={index}
                          selectMarker={this.selectMarker}/>
                      ) : null
                    }
                  </ul>
                </div>
              </li>
              <li
                className={`${style.mapListItem} ${this.state.placesMode === 'park' ? style.active : ''} panels-toggles`}
                onClick={() => this.changePlacesMode('park')}>
                <div className={style.basic}>
                  <img src={require('park.png')} className={`${style.left} ${style.icon} svg-parks-view`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>PARKS</div>
                    <span className="summary">See parks nearby</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg>
                  <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-parks`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={`${style.detailed}`}>
                  <ul className={`${style.placeSearchResult} custom-scroll`}>
                    {this.state.places && this.state.places.length && this.state.placesMode === 'park' ?
                      this.state.places.map((place, index) =>
                        <SearchResultsListItem
                          place={place}
                          icon="svg-parks-pin"
                          key={index}
                          selectMarker={this.selectMarker}/>
                      ) : null
                    }
                  </ul>
                </div>
              </li>
              <li
                className={`${style.mapListItem} ${this.state.placesMode === 'mosque' ? style.active : ''}  panels-toggles`}
                onClick={() => this.changePlacesMode('mosque')}>
                <div className={style.basic}>
                  <img src={require('mosque.png')} className={`${style.left} ${style.icon} svg-mosques-view`}/>
                  <div className={`${style.left} ${style.locDetail}`}>
                    <div className={style.title}>MOSQUES</div>
                    <span className="summary">See mosques nearby</span>
                  </div>
                  {/* <svg className={`${style.right} ${style.svgBlockArrow}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-view`}/>
                  </svg>
                  <svg className={`${style.right} ${style.svgBlockArrowActive}`}>
                    <use xmlnsXlink="http://www.w3.org/1999/xlink"
                         xlinkHref={`${require('desktop-property-detail.svg')}#svg-block-arrow-mosques`}/>
                  </svg> */}
                  <span className={`${style.right} ${style.spanBlockArrow}`}></span>

                </div>
                <div className={style.detailed}>
                  <ul className={`${style.placeSearchResult} custom-scroll`}>
                    {this.state.places && this.state.places.length && this.state.placesMode === 'mosque' ?
                      this.state.places.map((place, index) =>
                        <SearchResultsListItem
                          place={place}
                          icon="svg-mosques-pin"
                          key={index}
                          selectMarker={this.selectMarker}/>
                      ) : null
                    }
                  </ul>
                </div>
              </li>
            </ul>
          </div>
          <div className={`col-sm-7 col-xs-12 ${style.mapCommuteL}`} style={{ height: '518px', }}>
            <div className={style.mapCanvas} ref={`map_${this.props.id}`}/>
          </div>
        </div>
      </div>
    )
  }
}
