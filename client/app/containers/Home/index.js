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
import _ from 'lodash'
// import shuffle from 'lodash.shuffle'

import config from 'config'
import style from './style.css'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: null,
			searchBarArray: [],
			hotelPackages: [],
			featuredHotels: [],
			travelerPackages: [],
			locations: [],
			experiences: [],
		}
		super(props);
	}

	componentDidMount() {
		this.props.done();
		axios.get(`${config.apiPath}/fetch/locations-fetch?all=true`)
			.then((response) => {
				var searchBarArray =  response.data.items.map((location) => {
					return {value: location.ID, label: location.name}
				})
				this.setState({
					searchBarArray,
				})
		})

		axios.get(`${config.apiPath}/hotel/fetch?pageSize=8&pageNumber=1`)
		.then((response) => {
			var hotelPackages = response.data.items.map((item) => {
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

		axios.get(`${config.apiPath}/fetchFeaturedHotels/featuredHotel-fetchFeaturedHotels`)
		.then((response) => {
			var featuredHotels = _.shuffle(response.data);
			this.setState({
				featuredHotels,
			})
		})

		axios.get(`${config.apiPath}/fetchFeaturedPackages/featuredPackage-fetchFeaturedPackages`)
		.then((response) => {
			var travelerPackages = _.shuffle(response.data);
			this.setState({
				travelerPackages,
			})
		})

		axios.get(`${config.apiPath}/fetch/locations-fetch`)
		.then((response) => {
			var locations = _.shuffle(response.data && response.data.items);
			this.setState({
				locations,
			})
		})

		axios.get(`${config.apiPath}/fetch/experience-fetch`)
		.then((response) => {
			var experiences = _.shuffle(response.data && response.data.items);
			this.setState({
				experiences,
			})
		})
		
	}

	

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
		window.location = `/location/${selectedOption.value}`
  }

	render() {
		const { selectedOption } = this.state;
    return (
		<div>
			<div className="home-screen space-2" style={{paddingLeft: '0', backgroundColor:'#000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<div className={style.homeCoverStyle} style={{background: `url(${require('bg-header-e.jpg')})`}}>
				</div>
					<div className={style.coverTextWrapper}>
					<p className={`hidden-xs ${style.coverText}`}>WHERE TO?</p>
					<div>
						<p className={`hidden-xs ${style.subtitle}`}>Type in Any Location for Travel Guide</p>
					</div>
					<div className={`fa fa-search fa-lg ${style.searchIconDiv}`}></div>
					<div>
						<div className='searchButtonBar'>
							<h1 className='searchButtonText'>Search</h1>
						</div>
						<Select
							className={style.selectControl}
							classNamePrefix={'searchControl'}
							value={selectedOption}
							onChange={(option) => this.handleChange(option)}
							options={this.state.searchBarArray}
							placeholder={`Type in a location e.g. 'Naran Valley', 'Nathia Gali'`}
						/>
					</div>
					</div>
				</div>
					{
					this.state.featuredHotels.length ?
					<div className="col-sm-12 space-2 no-padding">
						<div className={`row ${style.horizontalScrollContainer}`}>
							<Fader width={(window.innerWidth/3)-17} maxWidth={window.innerWidth} unSlickTill={1024}  
							items={this.state.featuredHotels.map((data, index) => {
								return <FeaturedHotelTile width={'100%'} data={data} />
							})}>
							</Fader>
						</div>
					</div>
					: null
				}

					{ 
					this.state.hotelPackages.length ?
					<div className="container space-4">
							<h3 className={'no-margin-bottom'}>Hotel Resorts & their Packages</h3>
							<p className='space-4'>Best Hotels and resorts yet affordable for your next trip</p>
							<div className='row'>
								<div className={'horizontalScrollContainer'}>
								{/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items= */}
								{this.state.hotelPackages.map((data, index) => {
									return index <=7 ?
										<div id='tileCol' className='col-sm-3 no-padding-right'>
										<HotelPackageTile data={data} />
										</div> 
											: null
								})}
									{/* >
								</Fader> */}
								</div>
							</div>
						</div>
					: null
					}

				{ 
					this.state.travelerPackages.length ?
					<div className="container space-4">
						<h3 className={'no-margin-bottom'}>Top Traveller Packages by Tour Guide</h3>
						<p className='space-4'>Discover places with one of these popular guides</p>

						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							{/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items= */}
								{this.state.travelerPackages.map((data, index) => {
									return index <=7 ?
									<div id='tileCol' className='col-sm-3 no-padding-right'>
										<TravelerPackageTile data={data} />
									</div>
									: null
								})}
								{/* ></Fader> */}
							</div>
						</div>
					</div>
					: null
					}
					{ 
					this.state.locations.length ?
					<div className="container space-4">
						<h3 className={'no-margin-bottom'}>Recommended Locations for you</h3>
						<p className='space-4'>We recommend you visit these places</p>
						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							{/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items= */}
								{this.state.locations.map((data, index) => {
									return index <=9 ? 
									 <div id='tileCol' className='per-row-5 no-padding-right'>
											<RecommendationTile data={data} />
										</div>
									: null
								})}
								{/* ></Fader> */}
							</div>
						</div>
					</div>
					: null
					}
					{
					this.state.experiences.length ?
					<div className="container space-4">
						<h3 className={'no-margin-bottom'}>Top visited experiences</h3>
						<p className='space-4'>Book activities led by local hosts on your next trip</p>
						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							{/* <Fader width={225} maxWidth={1170} unSlickTill={1024} items= */}
								{this.state.experiences.map((data, index) => {
									return index <=9 ? 
									<div id='tileCol' className='per-row-5 no-padding-right'>
									 <VisitedExperiences data={data} />
									</div>
									 : null
								})}
								{/* ></Fader> */}
							</div>
						</div>
					</div>
					: null
					}
			</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Home)