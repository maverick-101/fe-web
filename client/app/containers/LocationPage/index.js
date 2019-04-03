import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';
import FeaturedHotelTile from 'components/FeaturedHotelTile';
import RecommendationTile from 'components/RecommendationTile';
import VisitedExperiences from 'components/VisitedExperiences';
import Fader from 'components/Fader';
import axios from 'axios';
import config from 'config';
import _ from 'lodash';

import { DateRangePicker, isInclusivelyAfterDay, isInclusivelyBeforerDay } from 'react-dates';

import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';

import style from './style.css'


class LocationPage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
			focusedInput: {},
			locations: [],
			location: {},
			travelerPackages: [],
			hotelPackages: [],
			experiences: [],
    }
		this.data = {
			travelerPackages: [
				{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', price:3000, url: require('../../../site-specs/sliced-images/traveller-package-01.png')},
				{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', price:3000, url: require('../../../site-specs/sliced-images/traveller-package-02.png')},
				{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', price:3000, url: require('../../../site-specs/sliced-images/traveller-package-03.png')},
		],
		hotelPackages: [
			{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-resort-01.png')},
			{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', price:3000, url: require('../../../site-specs/sliced-images/hotel-resort-02.png')},
			{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-resort-03.png')},
		],
		featuredHotels: [
			{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', min_price:3000, url: require('../../../site-specs/sliced-images/package-thumb-01.png')},
			{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', min_price:5000, url: require('../../../site-specs/sliced-images/package-thumb-02.png')},
			{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', min_price:7000, url: require('../../../site-specs/sliced-images/package-thumb-03.png')},
		],
		featuredHotels: [
			{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', min_price:3000, url: require('../../../site-specs/sliced-images/package-thumb-01.png')},
			{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', min_price:5000, url: require('../../../site-specs/sliced-images/package-thumb-02.png')},
			{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', min_price:7000, url: require('../../../site-specs/sliced-images/package-thumb-03.png')},
		],
		recommendations: [
			{name:'Faisal Mosque', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-01.png')},
			{name:'Baltit Fort', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-02.png')},
			{name:'Sindh Fort', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-03.png')},
			{name:'Shah Rukn Tomb', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-04.png')},
			{name:'Lahore Fort', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-05.png')},
		],
		visitedExperiences: [
			{name:'Chillas Valley', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-01.png')},
			{name:'Islamabad Expressway', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-02.png')},
			{name:'Skardu Hotels', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-03.png')},
			{name:'Banjosa Lake', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-04.png')},
			{name:'Lahore Fort', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-05.png')},
			{name:'Islamabad Expressway', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-06.png')},
			{name:'Skardu Hotels', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-07.png')},
			{name:'Banjosa Lake', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-08.png')},
		],
		}
	}

	componentDidMount() {

		// axios.get(`${config.apiPath}/fetchFeaturedPackages/featuredPackage-fetchFeaturedPackages`)
		// .then((response) => {
		// 	var travelerPackages = response.data;
		// 	this.setState({
		// 		travelerPackages,
		// 	})
		// })

		// axios.get(`${config.apiPath}/fetch/locations-fetch`)
		// .then((response) => {
		// 	var locations = response.data;
		// 	this.setState({
		// 		locations,
		// 	})
		// })

		axios.get(`${config.apiPath}/hotel/fetchByLocation/${this.props.params.locationId}`)
		.then((response) => {
			var hotelPackages = response.data.map((item) => {
				return {
					name: item.name,
					id: item.ID,
					url: item.gallery && item.gallery.length ? item.gallery[0].url : null,
					minimum_price: item.minimum_price,
				}
			})
			this.setState({
				hotelPackages,
			})
		})

		axios.get(`${config.apiPath}/fetchByLocation/packagePage-fetchByLocation/${this.props.params.locationId}`)
		.then((response) => {
			var travelerPackages = _.shuffle(response.data);
			this.setState({
				travelerPackages,
			})
		})

		axios.get(`${config.apiPath}/fetch/experience-fetch`)
		.then((response) => {
			var experiences = _.shuffle(response.data);
			this.setState({
				experiences,
			})
		})

		axios.get(`${config.apiPath}/fetchById/location-fetchById/${this.props.params.locationId}`)
		.then((response) => {
			var location = response.data[0];
			this.setState({
				location,
			})
				axios.get(`${config.apiPath}/fetchByCity/location-fetchByCity/${location.city_id}`)
				.then((locationResponse) => {
					var locations = _.shuffle(locationResponse.data);
					this.setState({
						locations,
					})
				})
		})
		
	}

	render() {
		var { location } = this.state;
		console.log('location form satate', location)
    return (
		<div>
        {/* <div className={`col-sm-2 ${style.smallColumn}`}>
          <div className='space-4'></div>
          <div className='space-4'>
            <h5 className='space-2'>Dates</h5>
            <DateRangePicker
              startDate={this.state.startDate} // momentPropTypes.momentObj or null,
              endDate={this.state.endDate} // momentPropTypes.momentObj or null,
              withPortal= {true}
              onDatesChange={({ startDate, endDate }) => {
                this.changeDates(startDate, endDate);
              }}
              startDatePlaceholderText = 'Check in'
              endDatePlaceholderText = 'Check Out'
              showDefaultInputIcon= {true}
              focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
              onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              numberOfMonths={2}
            />
          </div>
          <div className='space-4'>
            <h5 className='space-2'>Guests</h5>
            <div style={{position: 'relative'}}>
              <select name="month" className={`form-control ${style.guestSelect}`}>
                <option value="">Guests</option>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                  (number, index) => <option key={index} value={number}>{number}</option>
                )}
              </select>
              <i style={{color: '#00b3b3', position: 'absolute', top: 10, right: 10}} className="fa fa-chevron-down"></i>
            </div>
          </div>
        </div> */}
        <div className={`${style.largeColumn}`}>
					{/* <div className="container space-4">
						<h1>Top Rated Experiences in {location.name}</h1>
						<p className='space-4'>Book activities led by local hosts on your next trip</p>
						<Fader width={250} maxWidth={1280} unSlickTill={1024} items=
								{this.data.visitedExperiences.map((data, index) => {
									return <VisitedExperiences data={data} />
								})}></Fader>
					</div> */}
					{ 
					this.state.hotelPackages.length ?
					<div className="container space-4">
							<h3 className={'no-margin-bottom'}>Hotel Resorts & their Packages</h3>
							<p className='space-4'>Best Hotels and resorts yet affordable for your next trip</p>
							<div className='row'>
								<div className={'horizontalScrollContainer'}>
								{/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items={ */}
									{this.state.hotelPackages.map((data, index) => {
										return <div className='col-sm-3 no-padding'>
										<HotelPackageTile data={data} />
										</div>
									})}
									{/* }>
								</Fader> */}
								</div>
							</div>
							<div className="container space-4">
								<h4 style={{color: 'orange'}}>Show all experiences</h4>
							</div>
						</div>
					: null
					}
          <div className="container space-4">
						<h3>Top Visited Experiences in {location.name}</h3>
						<p className='space-4'>Book activities led by local hosts on your next trip</p>
						<div className='horizontalScrollContainer row'>
						{/* <Fader width={250} maxWidth={1280} unSlickTill={1024} items= */}
								{this.state.experiences.map((data, index) => {
								return <div id='tileCol' className='per-row-5 no-padding-right'>
									<VisitedExperiences data={data} />
									</div>
						})}
						</div>
						{/* ></Fader> */}
					</div>
					<div className="container space-4">
						<h4 style={{color: 'orange'}}>Show all experiences</h4>
					</div>
          <div className="container space-4">
						<h3>Recommended Locations for you</h3>
						<p className='space-4'>Locations you might be interseted to visit</p>
						{/* <Fader width={250} maxWidth={1280} unSlickTill={1024} items= */}
						<div className='horizontalScrollContainer row'>
						{this.state.locations.map((data, index) => {
							return <div id='tileCol' className='col-sm-3 padding-col-10'>
							 <RecommendationTile data={data} />
							 </div>
						})}
						</div>
						{/* ></Fader> */}
					</div>
          { this.state.travelerPackages.length ?
					<div className="container space-4">
						<h3>Popular Guides in {location.name}</h3>
						<p className='space-4'>Discover places with one of these popular guides</p>
						<div className='horizontalScrollContainer'>
						{this.state.travelerPackages.map((data, index) => {
							return <div id='tileCol' className='col-sm-3'>
							 <TravelerPackageTile data={data} />
							 </div>
						})}
						</div>
					</div>
					: null
				}

        </div>
					
			</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(LocationPage)
