import React from 'react'
import { connect } from 'react-redux'
import HotelContactCard from 'components/HotelContactCard';
import config from 'config'
import axios from 'axios';
import { sanitize, _amenities, checkForHttps, imgUpload } from 'helpers';
import Lightbox from 'react-image-lightbox'
import StarRatings from 'react-star-ratings';
import swal from 'sweetalert2';
import HotelPackageTile from 'components/HotelPackageTile';
import Fader from 'components/Fader';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";



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
      lightboxOpen: false,
      rating: 5,
      disableSubmit: true,
      hotelPackages: [],
      hotelRooms:[],
      hotelImages: [],
      bookingData: {},
      fetchedReviews: [],
      currentImage: 0,
    }
  }

  openLightbox(type) {
    var { hotelImages } = this.state;
    // var hotelImagesObject = Object.assign({}, hotelImages);
    
    var selectedPhotos = [];
    hotelImages.map((images) => {
      if(images._id == type) {
        images.Resources.map((image, index) => {
          selectedPhotos.push(image.url);
        })
      }
    })
    this.setState({
      selectedPhotos,
    }, () => {
      this.setState({
        lightboxOpen: true,
      })
    })
  }

  changeRating(rating, name) {
    this.setState({
      rating,
    })
  }

  submitReview() {
    var { reviewText, rating, reviewName } = this.state;
    var obj = {
      "hotel_id": this.state.hotel.ID,
      "status": "PENDING",
      "comment": reviewText,
      "user_name": reviewName,
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

  updateBookingData(name, value) {
    var { bookingData } = this.state;
    bookingData[name] = value;
    this.setState({
      bookingData,
    })
  }

  submitBooking() {
    var { bookingData } = this.state;
    if(bookingData.room_id && bookingData.persons && bookingData.start_date && bookingData.end_date && bookingData.nights_stay && bookingData.user_phone  && bookingData.user_email && bookingData.user_name ) {
      axios.post(`${config.apiPath}/save/hotelContact-save`, {hotelContact: JSON.stringify(bookingData)})
      .then(() => {
        swal({
          title: 'Success',
          html: 'Your query has been submitted. Our agent will contact you shortly',
          type: 'success',
        })
        this.contactCardRef.hideModal();
      })
    }
    else {
      swal({
        title: 'Incomplete Data',
        html: 'Please Select a room and fill your details before proceeding',
        type: 'info',
      })
    }
  }
  
  componentDidMount() {
		this.props.done();
    axios.get(`${config.apiPath}/hotel/fetchById/${this.props.params.hotelId}`)
		.then((response) => {
      var hotel = response.data;
      var amenityNames = [];
      hotel.hotel_amenities.filter((amenity) => {
        if(amenity.value)
        {
          amenityNames.push(amenity.name.split(' ').join('_').toLocaleLowerCase())
          return true;
        }
      })
      var hotelGallery = hotel.gallery.map((image) => {
        return {
          original: imgUpload(image.url, 'h_750'),
          thumbnail: imgUpload(image.url, 'h_100'),
        }
      })
      this.setState({
        hotel,
        amenityNames,
        hotelGallery,
      })
    })

    axios.get(`${config.apiPath}/hotel/fetch`)
		.then((response) => {
			var hotelPackages = response.data.map((item) => {
				return {
					name: item.name,
					id: item.ID,
					url: item.gallery && item.gallery.length ? imgUpload(item.gallery[0].url, 'h_400') : null
				}
			})
			this.setState({
				hotelPackages,
			})
    })

    axios.get(`${config.apiPath}/room/fetchByHotelId/${this.props.params.hotelId}`)
		.then((response) => {
			var hotelRooms = response.data
			this.setState({
				hotelRooms,
			})
    })
    
    
    axios.get(`${config.apiPath}/fetchByHotelId/hotelResources-fetchByHotelId/${this.props.params.hotelId}`)
    .then((response) => {
      var hotelImages = response.data;
      this.setState({
        hotelImages,
      })
    })
    axios.get(`${config.apiPath}/fetchAcceptedHotelById/hotelRating-fetchAcceptedHotelById/${this.props.params.hotelId}`)
    .then((response) => {
      var fetchedReviews = response.data;
      this.setState({
        fetchedReviews,
      })
    })
  }

	render() {
    const images = [
      {
        original: 'http://lorempixel.com/1000/600/nature/1/',
        thumbnail: 'http://lorempixel.com/250/150/nature/1/',
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/2/',
        thumbnail: 'http://lorempixel.com/250/150/nature/2/'
      },
      {
        original: 'http://lorempixel.com/1000/600/nature/3/',
        thumbnail: 'http://lorempixel.com/250/150/nature/3/'
      }
    ]
    var { hotel, hotelImages, hotelGallery, fetchedReviews, selectedPhotos, hotelRooms, disableSubmit } = this.state;
    return (
      <div>
    {    hotel 
        && hotelImages
     ? 
		<div>
      {/* <div className={`space-4 ${style.hotelCovers}`}>
        <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${hotel.gallery && hotel.gallery.length ? hotel.gallery[0].url : placeholder })` }}></div>
      </div> */}
      <div className='space-4'>
        <ImageGallery items={hotelGallery} />
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
            <HotelContactCard
              ref={r => this.contactCardRef = r}
              starRating={hotel.star_rating}
              submitBooking={()=> {this.submitBooking()}}
              updateBookingData={(name, value) => this.updateBookingData(name, value)} 
              rooms={hotelRooms} 
              id={hotel.id}
              price={hotel.minimum_price}
              type='hotel'
            />
          </div>
        </div>
        <div className='row space-4'>
          <div className='col-sm-12'>
            <h1>Tour this hotel</h1>
            <div className={`row ${style.amenitiesScroll}`}>
            {hotelImages.map((image) => {
              return <div onClick={() => { this.openLightbox(image._id) }} className={`col-sm-3 inline-block space-4 ${style.amenityDiv}`}>
                <div className={`bgDiv ${style.featureImage}`} style={{background:`url(${imgUpload(image.Resources[0].url, 'h_400')})` }}></div>
                <p className={style.tileCaption} style={{margin: '10px, 0'}}>{humanize(image._id)}</p>
              </div>
            })}
              </div>
              {/* <h4 className='orange'>Explore all 20 photos</h4> */}
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
          <div className='row space-8'>
            <div className='col-sm-12 space-4'>
              <h2>Recommended Hotels For You</h2>
              <div className='row'>
                  <div className={style.horizontalScrollContainer}>
                  {/* <Fader width={320} maxWidth={1280} unSlickTill={1024} items= */}
                  {
                    this.state.hotelPackages.map((data, index) => {
                      return index <=7 ? <div id='tileCol' className='col-sm-3 no-padding-right'>
                      <HotelPackageTile data={data} />
                      </div> : null
                    })
                  }
                    {/* >
                  </Fader> */}
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
                  </div>
                  <div style={{padding: '0 20px'}}>
                    <hr style={{width: '100%'}}/>
                  </div>
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
                  {/* <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        {this.state.lightboxOpen ? <Lightbox
          mainSrc={checkForHttps(selectedPhotos[this.state.currentImage])}
          isOpen={this.state.lightboxOpen}
          nextSrc={checkForHttps(selectedPhotos[(this.state.currentImage + 1) % selectedPhotos.length])}
          prevSrc={checkForHttps(selectedPhotos[(this.state.currentImage + selectedPhotos.length - 1) % selectedPhotos.length])}
          onCloseRequest={() => this.setState({ lightboxOpen: false })}
          onMoveNextRequest={() => this.setState({ currentImage: (this.state.currentImage + 1) % selectedPhotos.length })}
          onMovePrevRequest={() => this.setState({ currentImage: (this.state.currentImage + selectedPhotos.length - 1) % selectedPhotos.length })}
        /> : null}
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