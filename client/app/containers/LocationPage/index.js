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
import { convertPrice, imgUpload } from 'helpers'


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
	}

	componentDidMount() {
		this.props.done();
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
        <div className={`${style.largeColumn}`}>
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
						{location.video_link && location.video_link.length ? <div className='row space-4'>
							<div className='col-sm-12'>
								<h3 className='space-4'>Video</h3>
								<div>
									<iframe width="100%" height="500" src={`https://www.youtube.com/embed/${location.video_link[0]}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
								</div>
							</div>
						</div> : null
					}
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
							return <div id='tileCol' className='per-row-5 no-padding-right'>
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
