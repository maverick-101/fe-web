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

class AllHotels extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: null,
			searchBarArray: [],
			hotelPackages: [],
			featuredHotels: [],
			travelerPackages: [],
			locations: [],
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

		axios.get(`${config.apiPath}/hotel/fetch?all=true`)
		.then((response) => {
			var hotelPackages = response.data && response.data.items.map((item) => {
				return {
					name: item.name,
					id: item.ID,
					url: item.gallery && item.gallery.length ? item.gallery[0].url : null,
					minimum_price: item.minimum_price,
				}
			})
			this.setState({
				hotelPackages: _.shuffle(hotelPackages),
			})
		})
		
	}

	render() {
		const { hotelPackages } = this.state;
    return (
      <div className='container'>
        <h1>All Hotels</h1>
        <div className='horizontalScrollContainer row'>
        {
          hotelPackages.map((hotel, index) => {
            return <div id='tileCol' className='col-sm-3 no-padding-right'>
              <HotelPackageTile data={hotel} />
            </div>
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
})(AllHotels)