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
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

import StarRatings from 'react-star-ratings';

// import shuffle from 'lodash.shuffle'

import config from 'config'
import style from './style.css'

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
];

const activities = [
	{
		title: 'Title No. 1',
		description: 'Lorem Lorem nulla ullamco voluptate. Anim minim anim occaecat enim amet. Qui magna dolore amet elit mollit aute do veniam aliquip. Officia occaecat exercitation cillum sunt culpa duis minim eu deserunt elit esse non ea. Aliqua amet culpa qui labore voluptate aliquip non mollit duis culpa eiusmod Lorem. Nostrud dolor qui ipsum eu id ea proident aliqua. Ad dolore proident ullamco eiusmod tempor nulla irure ea sunt.'
	},
	{
		title: 'Title No. 2',
		description: 'Lorem Lorem nulla ullamco voluptate. Anim minim anim occaecat enim amet. Qui magna dolore amet elit mollit aute do veniam aliquip. Officia occaecat exercitation cillum sunt culpa duis minim eu deserunt elit esse non ea. Aliqua amet culpa qui labore voluptate aliquip non mollit duis culpa eiusmod Lorem. Nostrud dolor qui ipsum eu id ea proident aliqua. Ad dolore proident ullamco eiusmod tempor nulla irure ea sunt.'
	}
]

const images = [
	{name:'Naran Valley', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-01.png')},
	{name:'Saiful Malook', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-02.png')},
	{name:'Baltit For', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-03.png')},
	{name:'SeaView Karachi', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-04.png')},
	{name:'Shahi Qila', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-05.png')},
	{name:'Lal Qila', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-01.png')},
	{name:'Lahore Fort', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-02.png')},
	{name:'Rawalpindi Stadium', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-03.png')},
	{name:'Bijli Ghar', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-04.png')},
	{name:'Air Base', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-05.png')},
]

class ExperiencePage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: null,
			searchBarArray: [],
			hotelPackages: [],
			featuredHotels: [],
			travelerPackages: [],
			locations: [],
			fetchedReviews: [],
			disableSubmit: [],
			rating: 5,

		}
		super(props);
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

		axios.get(`${config.apiPath}/hotel/fetch?pageSize=8&pageNumber=1`)
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
				hotelPackages: hotelPackages,
			})
		})

		axios.get(`${config.apiPath}/fetchByExperienceId/experienceRating-fetchByExperienceId/${this.props.params.experienceId}`)
    .then((response) => {
      var fetchedReviews = response.data;
      this.setState({
        fetchedReviews,
      })
    })

		axios.get(`${config.apiPath}/fetchById/experience-fetchById/${this.props.params.experienceId}`)
		.then((response) => {
			const experience = response.data[0];
			const gallery = experience.gallery;
			var galleryImages = gallery.map((img) => {
				return {
					original: img.url,
					thumbnail: img.url,
				}
			})
			this.setState({
				experience,
				galleryImages,
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

	submitReview() {
    var { reviewText, rating, reviewName } = this.state;
    var obj = {
      "experience_id": this.props.params.experienceId,
      "status": "PENDING",
      "comment": reviewText,
      "user_name": reviewName,
      "user_id": 3,
      "rating": rating,
    }
    axios.post(`${config.apiPath}/save/experienceRating-save`, {experienceRating: JSON.stringify(obj)} )
    .then((response) => {
      swal({
        title: 'success',
        html: 'Your Review has been submitted',
        type: 'success',
      })
      this.setState({
        disableSubmit: true,
      })
      this.reviewTextarea.value = ''
    })
  }

	changeRating(rating, name) {
    this.setState({
      rating,
    })
  }
	

	handleChange = (selectedOption) => {
		this.setState({ selectedOption });
		window.location = `/location/${selectedOption.value}`
  }

	render() {
		const { disableSubmit, experience, galleryImages } = this.state;
		if (!experience) {
			return <p>Loading Data</p>
		} else {

		console.log(experience)
		console.log(experience.longitude)
			return (
				<div className='container' style={{marginTop:'20px'}}>
					<div className='row space-8'>
						<div className='sticky-container'>
							<div className='col-sm-4 sticky-div'>
								<div className='experience-gallery'>
									<ImageGallery bulletClass='customBullet' showBullets={true} showPlayButton={false} showThumbnails={false} lazyload={true} items={galleryImages} />
								</div>
							</div>
							<div className='col-sm-8'>
								<div className='experience-details space-8'>
									<h2 className='no-margin'>{experience.experience_title}</h2>
									<p className='space-4'>Gilgit Baltistan Province in Pakistan</p>
									<div className='space-4' dangerouslySetInnerHTML={{__html: experience.description}}></div>
									<div>
										<p className='space-4'> <span><i className='fa fa-map-marker fa-lg inline-block'></i></span>{experience.location && experience.location.name || 'location not provided'}</p>
									</div>
									<div>
										<p className='space-4'> <span><i className='fa fa-clock-o fa-lg inline-block'></i></span>{experience.duration || 'Duration Not Provided'}</p>
									</div>
									<div>
										<p className='space-4'> <span><i className='fa fa-phone fa-lg inline-block'></i></span>+92333-4045050</p>
									</div>
								</div>
								<div className='space-4'>
									<h3>What We'll Do</h3>
									<hr className='no-margin space-4'/>
									<div>
										{
											experience.todo.map((activity) => {
												return <div className='space-4'>
														<h4>{activity.todo_title}</h4>
														<div dangerouslySetInnerHTML={{__html: activity.description}}></div>
												</div>
											})
										}
									</div>
								</div>
								<div className='space-4'>
									<h3>Important Information</h3>
									<hr className='no-margin space-4'/>
									<div>
										<div dangerouslySetInnerHTML={{__html: experience.important_information}}></div>
										{/* <p>Lorem Lorem nulla ullamco voluptate. Anim minim anim occaecat enim amet. Qui magna dolore amet elit mollit aute do veniam aliquip. Officia occaecat exercitation cillum sunt culpa duis minim eu deserunt elit esse non ea. Aliqua amet culpa qui labore voluptate aliquip non mollit duis culpa eiusmod Lorem. Nostrud dolor qui ipsum eu id ea proident aliqua. Ad dolore proident ullamco eiusmod tempor nulla irure ea sunt.</p> */}
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='row'>
						<div className='sticky-container'>
							<div className='col-sm-4 sticky-div'>
								<div style={{paddingTop: '60px'}}>
									<h2>Guest Photos</h2>
								</div>
							</div>
							<div className='col-sm-8 user-photos-wrapper'>
									{
										experience.guest_gallery.map((image) => {
										return	<div className='col-sm-4 space-4 no-padding-right'>
												<img width='100%' height='300px' src={image.url} alt="user photos"/>
											</div>
										})
									}
							</div>
						</div>
					</div>
					<div id='location' className='row space-4'>
						<div className='col-sm-12'>
							<h2>Location</h2>
							<div className='row'>
								<div className='col-sm-12'>
									<iframe width="100%" height="500" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${experience.latitude},${experience.longitude}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
								</div>
							</div>
						</div>
					</div>
					<div className='row space-4'>
							<div id='reviews' className='col-sm-12'>
								<h2 className={`${style.heading} space-4`}>User Reviews and Ratings</h2>
								<div className='row'>
									<div className='col-sm-12'>
										{
											this.state.fetchedReviews.map((review, index) => {
												return (
													<div className='col-sm-6 space-2 no-padding'>
														<div className='row space-1'>
															<div className='vcenter' style={{display: 'inline-block'}}>
																<div className={`bgDiv ${style.reviewImage}`} style={{background:`url(${review.user ? review.user.profile_image : placeholder})` }}></div>
															</div>
															<div style={{display: 'inline-block', paddingTop: '15px'}} className='vcenter'>
																<h4 className='no-margin'>{review.user ? review.user.name : (review.name || 'Guest User')}</h4>
																<p>5 days ago</p>
															</div>
															<div style={{display: 'inline-block', paddingTop: '30px'}} className='vcenter'>
																<StarRatings
																	rating={review.rating}
																	starRatedColor="#e3530d"
																	numberOfStars={5}
																	starDimension="20px"
																	starSpacing="0px"
																	svgIconViewBox={'0 0 20 20'}
																	gradientPathName={window.location.pathname}
																	svgIconPath="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
																	name='rating'
																/>
															</div>
														</div>
														<div className='row'>
															<div className='col-sm-12'>{review.comment}</div>
														</div>
													</div>
												)
											})
										}
										{this.state.fetchedReviews.length ? <div style={{padding: '0 20px'}}>
											<hr style={{width: '100%'}}/>
										</div> : null}
										<div className="">
										 <h5>Write a Review</h5>
											<div className='col-sm-8 no-padding'>
												<div className='col-sm-6 no-padding'>
													<input ref={r => this.reviewNameInput = r} onChange={(e) => {  this.setState({disableSubmit: e.target.value ? false : true, reviewName: e.target.value}) }} className={style.ratingName} type="text" placeholder="Name"/>
												</div>
												<textarea ref={r => this.reviewTextarea = r} onChange={(e) => {  this.setState({disableSubmit: e.target.value ? false : true, reviewText: e.target.value}) }} className='hotelRatingInput' placeholder="Tell us about your experience at this place" rows="4" maxlength="500"/>
											</div>
											<div style={{paddingTop: '60px'}} className='col-sm-4'>
												<div style={{height: '85px', padding: '0 15px 15px 15px'}} className='text-center'>
													<p>Rate this place</p>
													<StarRatings
														rating={this.state.rating}
														isAggregateRating={true}
														starRatedColor="#e3530d"
														changeRating={(rating, name) => this.changeRating(rating, name)}
														numberOfStars={5}
														starDimension="40px"
														starSpacing="0px"
														svgIconViewBox={'0 0 20 20'}
														gradientPathName={window.location.pathname}
														svgIconPath="M9.5 14.25l-5.584 2.936 1.066-6.218L.465 6.564l6.243-.907L9.5 0l2.792 5.657 6.243.907-4.517 4.404 1.066 6.218"
														name='rating'
													/>
												</div>
												<button disabled={disableSubmit} style={{height: '35px'}} onClick={() => {this.submitReview()}} className='btn btn-block btn-orange'>Submit Review</button>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
				</div>
			)
		}
  } 
}

export default connect(store => {
	return {
	}
})(ExperiencePage)