import React from 'react'
import { connect } from 'react-redux'
import HotelContactCard from 'components/HotelContactCard';
import config from 'config'
import axios from 'axios';
import { sanitize, _amenities, checkForHttps } from 'helpers';
import Lightbox from 'react-image-lightbox'
import StarRatings from 'react-star-ratings';
import swal from 'sweetalert2';
import HotelPackageTile from 'components/HotelPackageTile';
import Fader from 'components/Fader';



import placeholder from 'no-image.jpg';

import style from './style.css'

function humanize(str) {
  var frags = str.split('_');
  for (var i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

class HotelPage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      selectedPhotos: [],
      coverImagesLightboxIsOpen: false,
      rating: 5,
      disableSubmit: true,
      hotelPackages: [],
    }
		this.data = {
			hotelCovers: [
				{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-1.jpg')},
				{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', price:3000, url: require('../../../site-specs/sliced-images/hotel-2.jpg')},
				{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-3.jpg')},
    ],
      hotelFeatures : [
          {name:'TV Lounge', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-01.png')},
          {name:'Main Hall', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-02.png')},
          {name:'Gallery Sitting', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-03.png')},
          {name:'Hotel Parking', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-04.png')},
          {name:'Executive Rooms', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-05.png')},
          {name:'TV Lounge', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-01.png')},
          {name:'Main Hall', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-02.png')},
          {name:'Gallery Sitting', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-03.png')},
          {name:'Hotel Parking', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-04.png')},
          {name:'Lobby', reviews: '684 reviews', rating: '3.5', url: require('../../../site-specs/sliced-images/top-visited-05.png')},
      ],
      hotelAmenities : [
        {name:'WiFi', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-01.png')},
        {name:'TV', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-02.png')},
        {name:'Bathroom Accessories', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-03.png')},
        {name:'Bedroom Comforts', reviews: '684 reviews', url: require('../../../site-specs/sliced-images/recommended-thumb-04.png')},
    ],
    reviews: [
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      // {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
    ],
		}
  }

  openLightbox() {

  }

  changeRating(rating, name) {
    console.log(rating)
    this.setState({
      rating,
    })
  }

  submitReview() {
    var { reviewText, rating } = this.state;
    var obj = {
      "hotel_id": this.state.hotel.ID,
      "status": "PENDING",
      "comment": reviewText,
      "rating": rating,
    }
    axios.post(`${config.apiPath}/save/hotelRating-save`, {hotelRating: JSON.stringify(obj)} )
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
  
  componentDidMount() {
    axios.get(`${config.apiPath}/hotel/fetchById/${this.props.params.hotelId}`)
		.then((response) => {
      var hotel = response.data;
      var amenityNames = [];
      console.log('hotel Data', hotel);
      var amenities = hotel.hotel_amenities.filter((amenity) => {
        if(amenity.value)
        {
          amenityNames.push(amenity.name.split(' ').join('_').toLocaleLowerCase())
          return true;
        }
      })
      console.log('filtered amenities', amenityNames)
      this.setState({
        hotel,
        amenityNames,
      })
    })

    axios.get(`${config.apiPath}/hotel/fetch`)
		.then((response) => {
			var hotelPackages = response.data.map((item) => {
				return {
					name: item.name,
					id: item.ID,
					url: item.gallery && item.gallery.length ? item.gallery[0].url : null
				}
			})
			console.log(hotelPackages)
			this.setState({
				hotelPackages,
			})
		})
    
    axios.get(`${config.apiPath}/fetchByHotelId/hotelImage-fetchByHotelId/${this.props.params.hotelId}`)
    .then((response) => {
      var hotelImages = response.data;
      this.setState({
        hotelImages,
      })
    })
    axios.get(`${config.apiPath}/fetchByHotelId/hotelRating-fetchByHotelId/${this.props.params.hotelId}`)
    .then((response) => {
      var fetchedReviews = response.data;
      console.log(fetchedReviews)
      this.setState({
        fetchedReviews,
      })
    })
  }

	render() {
    var { hotel, hotelImages, selectedPhotos, disableSubmit } = this.state;
    return (
      <div>
    {    hotel && hotelImages ? 
		<div>
      <div className={`space-4 ${style.hotelCovers}`}>
        {/* {
          this.data.hotelCovers.map((image) => {
           return <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${image.url})` }}></div>
        })
        } */}
        <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${hotel.gallery && hotel.gallery.length ? hotel.gallery[0].url : placeholder })` }}></div>
      </div>
      <div className="container space-4">
        <div className="row space-4">
          <div className='col-sm-8'>
            <h1>{hotel.name}</h1>
            <h4>{hotel.address}</h4>
            <div dangerouslySetInnerHTML={{__html: sanitize(hotel.description)}}></div>
            {/* <div className='row'>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>4 guests</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bedroom</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bath</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>2 Beds</h4>
            </div> */}
            <hr/>
          </div>
          <div className={'col-sm-4'}>
            <HotelContactCard/>
          </div>
        </div>
        <div className='row space-4'>
          <div className='col-sm-12'>
            <h1>Tour this hotel</h1>
            <div className={`row ${style.amenitiesScroll}`}>
            {hotelImages.map((image) => {
              return <div onClick={() => { this.openLightbox(image.image_type) }} className={`col-sm-2 inline-block space-4 ${style.amenityDiv}`}>
                <div className={`bgDiv ${style.featureImage}`} style={{background:`url(${image.images[0].url})` }}></div>
                <h4 style={{margin: '10px, 0'}}>{humanize(image.image_type)}</h4>
              </div>
            })}
              </div>
              <h4 className='orange'>Explore all 20 photos</h4>
            </div>
          </div>
          <hr/>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Amenities</h1>
              <div className={`row ${style.amenitiesScroll}`}>
                {this.state.amenityNames.map((name) => {
                  return <div className={`${style.amenityDiv} col-sm-2 inline-block space-4`}>
                    <div className={`bgDivContain space-2 ${style.amenityImage}`} style={{background:`url(${_amenities[name].image})` }}></div>
                    <h5 className={'ellipses no-margin'} style={{margin: '10px, 0'}}>{humanize(name)}</h5>
                  </div>
                })}
              </div>
                {/* <h4 className='orange'>Show all 9 amenities</h4> */}
            </div>
          </div>
          <hr/>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Location</h1>
              <div className='row'>
                <div className='col-sm-12'>
                  <iframe width="100%" height="500" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${hotel.latitude},${hotel.longitude}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Reviews</h1>
              <div className='row'>
                <div className='col-sm-12'>
                  <div className='space-4 clearfix'>
                  {
                    this.data.reviews.map((review, index) => {
                      return (
                        <div className='col-sm-6 space-2 no-padding'>
                          <div className='row space-1'>
                            <div className='vcenter' style={{display: 'inline-block'}}>
                              <div className={`bgDiv ${style.reviewImage}`} style={{background:`url(${review.image})` }}></div>
                            </div>
                            <div style={{display: 'inline-block', paddingTop: '15px'}} className='vcenter'>
                              <h4 className='no-margin'>{review.user}</h4>
                              <p>5 days ago</p>
                            </div>
                          </div>
                          <div className='row'>
                            <div className='col-sm-12'>{review.comments}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                  </div>
                  <div style={{padding: '0 20px'}}>
                    <hr style={{width: '100%'}}/>
                  </div>
                  <div className="">
                   <h5>Write a Review</h5>
                    <div className='col-sm-8 no-padding'>
                      <textarea ref={r => this.reviewTextarea = r} onChange={(e) => {  this.setState({disableSubmit: e.target.value ? false : true, reviewText: e.target.value}) }} className='hotelRatingInput' placeholder="Tell us about your experience at this place" rows="4" maxlength="500"/>
                    </div>
                    <div className='col-sm-4'>
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
                  {/* <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe> */}
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div className='row space-8'>
          <div className='col-sm-12 space-4'>
            <h1>Recommended Destinations For You</h1>
            <div className='row'>
                <Fader width={320} maxWidth={1280} unSlickTill={1024} items={this.state.hotelPackages.map((data, index) => {
										return <HotelPackageTile data={data} />
									})}>
								</Fader>
              </div>
            </div>
          </div>
        </div>
        {/* <Lightbox
          mainSrc={checkForHttps(selectedPhotos[this.state.currentImage])}
          isOpen={this.state.coverImagesLightboxIsOpen}
          nextSrc={checkForHttps(selectedPhotos[(this.state.currentImage + 1) % selectedPhotos.length])}
          prevSrc={checkForHttps(selectedPhotos[(this.state.currentImage + selectedPhotos.length - 1) % selectedPhotos.length])}
          onCloseRequest={() => this.setState({ coverImagesLightboxIsOpen: false })}
          onMoveNextRequest={() => this.setState({ currentImage: (this.state.currentImage + 1) % selectedPhotos.length })}
          onMovePrevRequest={() => this.setState({ currentImage: (this.state.currentImage + selectedPhotos.length - 1) % selectedPhotos.length })}
        /> */}
    </div>
    : null}
    </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(HotelPage)