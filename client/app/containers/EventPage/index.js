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
import Truncate from 'components/Truncate'
import placeholder from 'no-image.jpg';

import style from './style.css'

function humanize(str) {
  var frags = str.split('_');
  for (var i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

function getSizeOfCol(size) {
 return size == 0 ? null :
    (
      size == 1 ? 12 :
        (
          size == 2 ? 6 : (
            size == 3 ? 4 : (
              size == 4 ? 4 : (
                size > 4 ? 3 : null
              )
            )
          )
          ) 
    )
}

class HotelPage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      events: [],
    }
    this.event = {
      coverImage : 'https://cdn.zuerich.com/sites/default/files/styles/sharing/public/web_zuerich_home_topevents_1600x900.jpg?itok=NI4hhrwV'
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
    axios.get(`${config.apiPath}/fetchById/event-fetchById/${this.props.params.eventId}`)
      .then((response) => {
        this.setState({
          event: response.data,
        })
      })

    axios.get(`${config.apiPath}/fetch/event-fetch`)
    .then((response) => {
      var events = _.shuffle(response.data);
      this.setState({
        events,
      })
    })
  }
  
  // componentDidMount() {
	// 	this.props.done();
  //   axios.get(`${config.apiPath}/hotel/fetchById/${this.props.params.hotelId}`)
	// 	.then((response) => {
  //     var hotel = response.data;
  //     var amenityNames = [];
  //     hotel.hotel_amenities.filter((amenity) => {
  //       if(amenity.value)
  //       {
  //         amenityNames.push(amenity.name.split(' ').join('_').toLocaleLowerCase())
  //         return true;
  //       }
  //     })
  //     var hotelGallery = hotel.gallery.map((image) => {
  //       return {
  //         original: imgUpload(image.url, 'h_750'),
  //         thumbnail: imgUpload(image.url, 'h_100'),
  //       }
  //     })
  //     this.setState({
  //       hotel,
  //       amenityNames,
  //       hotelGallery,
  //     })
  //   })

  //   axios.get(`${config.apiPath}/hotel/fetch`)
	// 	.then((response) => {
	// 		var hotelPackages = response.data.map((item) => {
	// 			return {
	// 				name: item.name,
	// 				id: item.ID,
	// 				url: item.gallery && item.gallery.length ? imgUpload(item.gallery[0].url, 'h_400') : null
	// 			}
	// 		})
	// 		this.setState({
	// 			hotelPackages,
	// 		})
  //   })

  //   axios.get(`${config.apiPath}/room/fetchByHotelId/${this.props.params.hotelId}`)
	// 	.then((response) => {
	// 		var hotelRooms = response.data
	// 		this.setState({
	// 			hotelRooms,
	// 		})
  //   })
    
    
  //   axios.get(`${config.apiPath}/fetchByHotelId/hotelResources-fetchByHotelId/${this.props.params.hotelId}`)
  //   .then((response) => {
  //     var hotelImages = response.data;
  //     this.setState({
  //       hotelImages,
  //     })
  //   })
  //   axios.get(`${config.apiPath}/fetchAcceptedHotelById/hotelRating-fetchAcceptedHotelById/${this.props.params.hotelId}`)
  //   .then((response) => {
  //     var fetchedReviews = response.data;
  //     this.setState({
  //       fetchedReviews,
  //     })
  //   })
  // }

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
    var { event, events } = this.state;
    return (
      <div>
    {    event 
     ? 
     <div>
      <div>
      {/* <div className={`space-4 ${style.hotelCovers}`}>
        <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${hotel.gallery && hotel.gallery.length ? hotel.gallery[0].url : placeholder })` }}></div>
      </div> */}
        <div className='space-4'>
          <div className={'topCover bgDiv'} style={{background: `url(${event.cover_photo && event.cover_photo.url ? event.cover_photo.url : event.gallery[0].url})`}}></div>
          {/* <ImageGallery items={hotelGallery} /> */}
        </div>
        <div className="container space-4">
          <div className="row space-4">
            <div className='col-sm-12'>
              <h1 className='no-margin-bottom'>{event.title}</h1>
              <h4 className='opacity-80'>{event.Address}</h4>
              <Truncate lines={10} more={'Show More'} less={'Show Less'}>
                <div dangerouslySetInnerHTML={{__html: sanitize(event.description)}}></div>
              </Truncate>

              {/* <div className='row'>
                <h4 style={{display: 'inline-block', marginLeft: '20px'}}>4 guests</h4>
                <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bedroom</h4>
                <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bath</h4>
                <h4 style={{display: 'inline-block', marginLeft: '20px'}}>2 Beds</h4>
              </div> */}
            </div>
            <div className={'col-sm-4'}>
              {/* <HotelContactCard
                ref={r => this.contactCardRef = r}
                starRating={hotel.star_rating}
                submitBooking={()=> {this.submitBooking()}}
                updateBookingData={(name, value) => this.updateBookingData(name, value)} 
                rooms={hotelRooms} 
                id={hotel.id}
                price={hotel.minimum_price}
                type='hotel'
              /> */}
            </div>
          </div>
          <div className='row space-4'>
            <div className="col-sm-12">
              <hr/>
              <h2 className='space-4'>Event Highlights</h2>
              <div className="row">
              <div className={style.horizontalScrollContainer}>
							{/* <Fader width={280} maxWidth={1170} unSlickTill={1024} items= */}
								{event.gallery.map((image, index) => {
									return index <=9 ? 
									 <div id='tileCol' className='per-row-5 no-padding-right'>
											<div className={`${style.eventGalleryImage} bgDiv`} style={{background:`url(${image.url})`}}></div>
										</div>
									: null
								})}
								{/* ></Fader> */}
							</div>
              </div>
            </div>
          </div>
          <hr/>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h2 className='space-4'>Why Visit</h2>
              <div dangerouslySetInnerHTML={{__html: sanitize(event.why_list)}}></div>
            </div>
          </div>
          <hr/>
          {
            event.event_videos.length ? 
          <div className='row space-4'>
            <div className='col-sm-12'>
            <h2 className='space-4'>Event Videos</h2>
          {
            event.event_videos.map((videoUrl, index) => {
              return <div className={`no-padding col-sm-${getSizeOfCol(event.event_videos.length)}`}>
                <iframe width="100%" height="300px" src={`https://www.youtube.com/embed/${videoUrl.url}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
              </div>
            })
          }
            </div>
          </div> : null
        }
        <hr/>
          <div className="row space-4">
            <div className="col-sm-12">
              <h2 className='space-4'>Events in your city</h2>
              <div className='horizontalScrollContainer row'>
              {
                events.map((item, index) => {
                  return (
                  <div id='tileCol' className='col-sm-3 no-padding-right'>
                    <a href={`/event/${item.ID}`}>
                      <div className={style.eventsTileWrapper}>
                        <div style={{background: `url(${(item.cover_photo && item.cover_photo.url) || placeholder})`}} className={`bgDiv ${style.eventsTile}`}>
                        </div>
                        <h5>{item.title}</h5>
                        <p className='orange'>{item.Address}</p>
                      </div>
                    </a>
                  </div>)
                })
              }
              </div>
            </div>
          </div>
        </div>
      </div>
        </div> : null }
      </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(HotelPage)