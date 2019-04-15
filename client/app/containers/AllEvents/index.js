import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';
import FeaturedHotelTile from 'components/FeaturedHotelTile';
import RecommendationTile from 'components/RecommendationTile';
import VisitedExperiences from 'components/VisitedExperiences';
import Select from 'react-select';
import axios from 'axios';
import 'react-select/dist/react-select.css'
import placeholder from 'no-image.jpg';

import Fader from 'components/Fader'
import Slider from 'components/Slider'
// import shuffle from 'lodash.shuffle'
import _ from 'lodash'

import config from 'config'
import style from './style.css'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

class AllPackages extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			events: [],
		}
		super(props);
	}

	componentDidMount() {
		this.props.done();
		// axios.get(`${config.apiPath}/fetch/locations-fetch`)
		// 	.then((response) => {
		// 		var searchBarArray =  response.data.map((location) => {
		// 			return {value: location.ID, label: location.name}
		// 		})
		// 		this.setState({
		// 			searchBarArray,
		// 		})
    // })
    
    axios.get(`${config.apiPath}/fetch/event-fetch`)
		.then((response) => {
			var events = _.shuffle(response.data);
			this.setState({
				events,
			})
		})

		// axios.get(`${config.apiPath}/hotel/fetch`)
		// .then((response) => {
		// 	var hotelPackages = response.data.map((item) => {
		// 		return {
		// 			name: item.name,
		// 			id: item.ID,
		// 			url: item.gallery && item.gallery.length ? item.gallery[0].url : null,
		// 			minimum_price: item.minimum_price,
		// 		}
		// 	})
		// 	this.setState({
		// 		hotelPackages: hotelPackages,
		// 	})
		// })
		
	}

	render() {
		const { events } = this.state;
    return (
      <div className='container'>
        <h1>All Events</h1>
        <div className='horizontalScrollContainer row'>
        {
          events.map((event, index) => {
            return (
						<div id='tileCol' className='col-sm-3 no-padding-right'>
							<a href={`/event/${event.ID}`}>
								<div className={style.eventsTileWrapper}>
									<div style={{background: `url(${(event.cover_photo && event.cover_photo.url) || placeholder})`}} className={`bgDiv ${style.eventsTile}`}>
									</div>
									<h5>{event.title}</h5>
									<p className='orange'>{event.Address}</p>
								</div>
							</a>
            </div>)
          })
        }
        </div>
      </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(AllPackages)