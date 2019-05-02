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
import Truncate from 'components/Truncate';
import placeholder from 'no-image.jpg';

import './style.css'


function humanize(str) {
  var frags = str.split('_');
  for (var i=0; i<frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(' ');
}

class Dashboard extends React.Component {
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
          url: item.gallery && item.gallery.length ? imgUpload(item.gallery[0].url, 'h_400') : null,
          minimum_price: item.minimum_price,
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
      <div className="dashboard">
    <section className="secMainBody row">
		<div className="sideBarMain col-sm-2">
			<div className="sideBarContent">
				<a href="#">
					<img src="assets/img/icon1.svg" alt="" />
					My Bookings
				</a>
				<a href="#">
					<img src="assets/img/icon2.svg" alt="" />
					Inbox 
				</a>
				<a href="#">
					<img src="assets/img/icon3.svg" alt="" />
					Reviews
				</a>
				<a href="#">
					<img src="assets/img/icon4.svg" alt="" />
					Save listings
				</a>
				<a href="#">
					<img src="assets/img/icon5.svg" alt="" />
					Latest Deals
				</a>
				<a href="#">
					<img src="assets/img/icon6.svg" alt="" />
					Profile
				</a>
			</div>
		</div>
		<div className="sideBodyMain col-sm-10">
			<div className="tabMain">
				<ul className="nav nav-pills">
          <h1>Dashboard</h1>
					<li className="active"><a data-toggle="pill" href="#home">Upcoming</a></li>
					<li><a data-toggle="pill" href="#menu1">Completed</a></li>
					<li><a data-toggle="pill" href="#menu2">cancelled</a></li>
				</ul>

				<div className="tab-content">
					<div id="home" className="tab-pane fade in active">
						<h3>HOME</h3>
						<p>Some content.</p>
					</div>
					<div id="menu1" className="tab-pane fade">
						<h3>Menu 1</h3>
						<p>Some content in menu 1.</p>
					</div>
					<div id="menu2" className="tab-pane fade">
						<h3>Menu 2</h3>
						<p>Some content in menu 2.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

              </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(Dashboard)