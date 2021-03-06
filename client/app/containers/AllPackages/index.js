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

class AllPackages extends React.Component {
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
    
    axios.get(`${config.apiPath}/fetch/packagePage-fetch`)
		.then((response) => {
			var travelerPackages = _.shuffle(response.data && response.data.items);
			this.setState({
				travelerPackages,
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
		const { travelerPackages } = this.state;
    return (
      <div className='container'>
        <h1>All Packages</h1>
        <div className='horizontalScrollContainer row'>
        {
          travelerPackages.map((travelPackage, index) => {
            return <div id='tileCol' className='col-sm-3 no-padding-right'>
              <TravelerPackageTile data={travelPackage} />
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
})(AllPackages)