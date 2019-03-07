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

import config from 'config'


import style from './style.css'
import Axios from 'axios';

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
		}
		super(props);
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
		this.props.done();
		axios.get(`${config.apiPath}/fetch/locations-fetch`)
			.then((response) => {
				var searchBarArray =  response.data.map((location) => {
					return {value: location.ID, label: location.name}
				})
				this.setState({
					searchBarArray,
				})
		})

		axios.get(`${config.apiPath}/hotel/fetch`)
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

		axios.get(`${config.apiPath}/fetchFeaturedHotels/featuredHotel-fetchFeaturedHotels`)
		.then((response) => {
			var featuredHotels = response.data;
			this.setState({
				featuredHotels,
			})
		})

		axios.get(`${config.apiPath}/fetchFeaturedPackages/featuredPackage-fetchFeaturedPackages`)
		.then((response) => {
			var travelerPackages = response.data;
			this.setState({
				travelerPackages,
			})
		})

		axios.get(`${config.apiPath}/fetch/locations-fetch`)
		.then((response) => {
			var locations = response.data;
			this.setState({
				locations,
			})
		})
		
	}

	

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
		window.location = `/location/${selectedOption.value}`
    console.log(`Option selected:`, selectedOption);
  }

	render() {
		const { selectedOption } = this.state;
    return (
		<div>
			<div className="home-screen space-2" style={{paddingLeft: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<div className={style.homeCoverStyle} style={{background: `url(${require('../../../site-specs/sliced-images/background-bg.png')})`}}>
				</div>
					<div className={style.coverTextWrapper}>
					<p className={style.coverText}>WHERE TO?</p>
					<div>
						<p className={style.subtitle}>Type in Any Location for Travel Guide</p>
					</div>
					<div className={`fa fa-search fa-lg ${style.searchIconDiv}`}></div>
					<div>
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
					{/* <button className="btn btn-lg view-btn" style={{zIndex: 10, margin: 'auto', position: 'absolute', color: 'white', paddingLeft: '50px', paddingRight: '50px', width: '211.45px', border: '1px solid white'}}>VIEW MORE</button> */}
				</div>


					{
					this.state.featuredHotels.length ?
					<div className="col-sm-12 space-8 no-padding">
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
							<h2 className={'no-margin-bottom'}>Hotel Resorts & their Packages</h2>
							<p className='space-4'>Best Hotels and resorts yet affordable for your next trip</p>
							<div className='row'>
								<div className={style.horizontalScrollContainer}>
								<Fader width={280} maxWidth={1170} unSlickTill={1024} items={this.state.hotelPackages.map((data, index) => {
										return <HotelPackageTile data={data} />
									})}>
								</Fader>
								</div>
							</div>
						</div>
					: null
					}

				{ 
					this.state.travelerPackages.length ?
					<div className="container space-4">
						<h2 className={'no-margin-bottom'}>Top Traveller Packages by Tour Guide</h2>
						<p className='space-4'>Discover places with one of these popular guides</p>

						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							<Fader width={280} maxWidth={1170} unSlickTill={1024} items=
								{this.state.travelerPackages.map((data, index) => {
									return <TravelerPackageTile data={data} />
								})}></Fader>
							</div>
						</div>
					</div>
					: null
					}
					{ 
					this.state.locations.length ?
					<div className="container space-4">
						<h2 className={'no-margin-bottom'}>Recommended Locations for you</h2>
						<p className='space-4'>We recommend you visit these places</p>
						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							<Fader width={280} maxWidth={1170} unSlickTill={1024} items=
								{this.state.locations.map((data, index) => {
									return <RecommendationTile data={data} />
								})}></Fader>
							</div>
						</div>
					</div>
					: null
					}

					{
					this.data.visitedExperiences.length ?
					<div className="container space-4">
						<h2 className={'no-margin-bottom'}>Top visited experiences</h2>
						<p className='space-4'>Book activities led by local hosts on your next trip</p>
						<div className='row'>
							<div className={style.horizontalScrollContainer}>
							<Fader width={225} maxWidth={1170} unSlickTill={1024} items=
								{this.data.visitedExperiences.map((data, index) => {
									return <VisitedExperiences data={data} />
								})}></Fader>
							</div>
						</div>
					</div>
					: null
					}

					{/* <div className="container space-4">
						<h4 style={{color: 'orange'}}>Show all experiences</h4>
					</div> */}
			</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Home)