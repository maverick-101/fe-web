import React from 'react'
import { connect } from 'react-redux'
import { Card, CardText, CardBody, CardTitle, CardImg, Button} from 'reactstrap';
import TravelerPackageTile from 'components/TravelerPackageTile';
import HotelPackageTile from 'components/HotelPackageTile';
import FeaturedHotelTile from 'components/featuredHotelTile';
import RecommendationTile from 'components/RecommendationTile';
import VisitedExperiences from 'components/VisitedExperiences';

import style from './style.css'


class Home extends React.Component {
	constructor(props) {
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

	render() {
    return (
		<div>
			<div className="home-screen" style={{paddingLeft: '0', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
				<div className={style.homeCoverStyle} style={{background: `url(${require('../../../site-specs/sliced-images/background-bg.png')})`}}>
				</div>
					<p style={{color: 'white', fontWeight: 'bolder', fontSize: '45px', position: 'absolute', marginTop: '-75px', letterSpacing: '4px'}}>LETS EXPLORE TOGETHER</p>
					<button className="btn btn-lg view-btn" style={{zIndex: 10, margin: 'auto', position: 'absolute', color: 'white', paddingLeft: '50px', paddingRight: '50px', width: '211.45px', border: '1px solid white'}}>VIEW MORE</button>
				</div>
					<div className="col-sm-12 no-padding">
						{this.data.featuredHotels.map((data, index) => {
							return <FeaturedHotelTile data={data} />
						})}
					</div>

					<div className="container space-4">
						<div className="row"/> 
						<h1>Hotel Resorts & their Packages</h1>
						<p className='space-4'>Best Hotels and resorts yet affordable for your next trip</p>
						{this.data.hotelPackages.map((data, index) => {
							return <HotelPackageTile data={data} />
						})}
					</div>

					<div className="container space-4">
						<h1>Top Traveller Packages by Tour Guide</h1>
						<p className='space-4'>Discover places with one of these popular guides</p>
						{this.data.travelerPackages.map((data, index) => {
							return <TravelerPackageTile data={data} />
						})}
					</div>

					<div className="container space-4">
						<h1>Recommended for you</h1>
						{this.data.recommendations.map((data, index) => {
							return <RecommendationTile data={data} />
						})}
					</div>

					<div className="container space-4">
						<h1>Top visited experiences</h1>
						<p className='space-4'>Book activities led by local hosts on your next trip</p>
						{this.data.visitedExperiences.map((data, index) => {
							return <VisitedExperiences data={data} />
						})}
					</div>

					<div className="container space-4">
						<h4 style={{color: 'orange'}}>Show all experiences</h4>
					</div>
			</div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Home)