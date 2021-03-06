import React from 'react'
import { connect } from 'react-redux'
import HotelContactCard from 'components/HotelContactCard';
import Fader from 'components/Fader';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import axios from 'axios';
import config from 'config';
import StarRatings from 'react-star-ratings';
import swal from 'sweetalert2';
import RecommendationTile from 'components/RecommendationTile';
import style from './style.css'
import { convertPrice, imgUpload } from 'helpers'

class PackagePage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      activeItem: 'description',
      travelPackage: {},
      fetchedReviews: [],
      disableSubmit: true,
      rating: 5,
      bookingData: {},
      locations: [],
    }
  }

  loadWeatherWidget(lat, long) {
    let ref = window.document.getElementsByTagName('script')[0]
    let src = `https://darksky.net/widget/default/${lat},${long}/uk12/en.js?height=500&title=Full Forecast&textColor=333333&bgColor=FFFFFF&skyColor=333&fontFamily=Default&units=uk&htColor=333333&ltColor=C7C7C7&displaySum=yes&displayHeader=no` 
    let script = window.document.createElement('script')
    script.src = src
    script.async = true
    ref.parentNode.insertBefore(script, ref)
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
    axios.post(`${config.apiPath}/save/packageRating-save`, {packageRating: JSON.stringify(obj)} )
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

  updateBookingData(name, value) {
    var { bookingData } = this.state;
    bookingData[name] = value;
    this.setState({
      bookingData,
    })
  }

  submitBooking() {
    var { bookingData } = this.state;
    bookingData['packageId'] = this.props.params.packageId;
    if(bookingData.packageId && bookingData.persons && bookingData.start_date && bookingData.end_date && bookingData.duration && bookingData.user_phone  && bookingData.user_email && bookingData.user_name ) {
      axios.post(`${config.apiPath}/save/packageContact-save`, {packageContact: JSON.stringify(bookingData)})
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
    axios.get(`${config.apiPath}/fetchById/packagePage-fetchById/${this.props.params.packageId}`)
		.then((response) => {
      var travelPackage = response.data[0];
      var packageGallery = travelPackage.gallery.map((image) => {
        return {
          original: imgUpload(image.url, 'h_750'),
          thumbnail: imgUpload(image.url, 'h_100'),
        }
      })
      this.setState({
        travelPackage,
        packageGallery,
      }, () => {
        this.loadWeatherWidget(travelPackage.latitude,travelPackage.longitude)
      })
    })

    axios.get(`${config.apiPath}/fetch/locations-fetch`)
		.then((response) => {
			var locations = response.data && response.data.items;
			this.setState({
				locations,
			})
		})
  }

  scrollToDiv(id) {
    this.setState({activeItem: id})
    document.getElementById(id).scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
  }

	render() {
    var { travelPackage, packageGallery, disableSubmit } =  this.state;
    return (
		<div>
      <div className='space-4'>
        <ImageGallery lazyload={true} items={packageGallery} />
      </div>
      <div className="container space-4">
        <div className="row space-4">
          <div className='col-sm-8'>
            <h3 className='space-4'>Summary</h3>
            <div dangerouslySetInnerHTML={{__html: travelPackage.summary}}></div>
          </div>
          <div className={'col-sm-4'}>
            <HotelContactCard 
              ref={r => this.contactCardRef = r}
              starRating={travelPackage.star_rating}
              submitBooking={()=> {this.submitBooking()}}
              updateBookingData={(name, value) => this.updateBookingData(name, value)}
              id={travelPackage.id}
              price={travelPackage.minimum_price}
              type='package'
            />
          </div>
        </div>
        { travelPackage.video_link && travelPackage.video_link.length && travelPackage.video_link[0] !== 'null' ?
        <div className='row space-4'>
          <div className='col-sm-12'>
            <h3 className='space-4'>Video</h3>
            <div>
              <iframe width="100%" height="500" src={`https://www.youtube.com/embed/${travelPackage.video_link[0]}`} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
          </div>
        </div> : null
        }
        <hr/>
        <div className='clearfix'>
          <div className={`${style.tab} space-4 clearfix`}>
            <div className={`${style.tabsContainer}`}>
              <p onClick={() => {this.scrollToDiv('description')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'description' ? style.activeItem : null}`}>Description</p>
              <p onClick={() => {this.scrollToDiv('location')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'location' ? style.activeItem : null}`}>Location</p>
              {this.state.travelPackage.travel_modes && this.state.travelPackage.travel_modes.length ? <p onClick={() => {this.scrollToDiv('guide')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'guide' ? style.activeItem : null}`}>Travel Guide</p> : null}
              {this.state.travelPackage.activities && this.state.travelPackage.activities.length ? <p onClick={() => {this.scrollToDiv('activities')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'activities' ? style.activeItem : null}`}>Activities</p> : null}
              {this.state.travelPackage.price && this.state.travelPackage.price.length ? <p onClick={() => {this.scrollToDiv('pricing')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'pricing' ? style.activeItem : null}`}>Pricing</p> : null}
              <p onClick={() => {this.scrollToDiv('reviews')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'reviews' ? style.activeItem : null}`}>Reviews</p>
            </div>
          </div>
        </div>
        <div className='col-sm-12 no-padding space-4'>
          <div id='description' className='space-4'>
            <h3 className={`${style.heading} space-4`}>Description</h3>
            <div dangerouslySetInnerHTML={{__html: travelPackage.description}}></div>
          </div>
          <hr/>
          <div id='location' className='row space-4'>
            <div className='col-sm-12'>
              <h3>Location</h3>
              <div className='row'>
                <div className='col-sm-12'>
                  <iframe width="100%" height="500" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${travelPackage.latitude},${travelPackage.longitude}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          {this.state.travelPackage.travel_modes && this.state.travelPackage.travel_modes.length ? <div id='guide' className='space-8'>
            <h3 className={`${style.heading} clearfix space-4`}>Travel Guide</h3>
            {
              this.state.travelPackage.travel_modes && this.state.travelPackage.travel_modes.length && this.state.travelPackage.travel_modes.map((mode, index) => {
                return <div className={`col-sm-12 no-padding clearfix space-4 ${style.travelInfo}`}>
                  <h1 className={`inline-block clearfix ${style.bolder}`}>{mode.travelmodes_title}</h1>
                    <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                  <h1 className={`inline-block clearfix ${style.bolder}`}>{mode.travel_time}</h1>
                    <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                  <h1 className={`inline-block clearfix ${style.bolder}`}>{mode.travel_type}</h1>
                    <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                  <h1 className={`inline-block clearfix ${style.bolder}`}>{mode.departure}</h1>
                    <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                  <h1 className={`inline-block clearfix ${style.bolder}`}>{mode.destination}</h1>
                  <p>{mode.description}</p>
                </div>
              })
            }
            <div>
              <hr style={{width: '100%'}}></hr>
            </div>
          </div> : null}
          {this.state.travelPackage.activities && this.state.travelPackage.activities.length ? <div id='activities' className='space-8'>
            <h3 className={`${style.heading} clearfix space-4`}>Activities</h3>
            {
              this.state.travelPackage.activities && this.state.travelPackage.activities.length && this.state.travelPackage.activities.map((activity, index) => {
                return activity.status ? <div className={`col-sm-12 no-padding clearfix space-4 ${style.travelInfo}`}>
                  <h4 style={{fontSize: '16px'}} className='text-capitalize'>{activity.activity_type}</h4>
                  <p>{activity.description}</p>
                </div> : null
              })
            }
            <div>
              <hr style={{width: '100%'}}></hr>
            </div>
          </div> : null}
          {this.state.travelPackage.price && this.state.travelPackage.price.length ? <div id='pricing' className='space-4'>
            <h3 className={`${style.heading} space-4`}>Pricing</h3>
            {
              this.state.travelPackage.price && this.state.travelPackage.price.length && this.state.travelPackage.price.map((price, index) => {
                return <div className=''>
                  <div className={`col-sm-12 no-padding clearfix space-4 ${style.travelInfo}`}>
                    <h1 className={`inline-block clearfix ${style.bolder}`}>{price.person} Persons</h1>
                    <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{price.nights_stay} Nights Stay</h1>
                    </React.Fragment>
                    {price.wifi ? <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{'WIFI'}</h1>
                    </React.Fragment> : null}
                    {price.buffet ? <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{'Buffet'}</h1>
                    </React.Fragment> : null}
                    {price.dinner ? <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{'Dinner'}</h1>
                    </React.Fragment> : null}
                    {price.breakfast ? <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{'Breakfast'}</h1>
                    </React.Fragment> : null}
                    {price.shuttle_service ? <React.Fragment>
                      <p className={`${style.divider} clearfix inline-block`}>&nbsp;&#9679;&nbsp;</p>
                      <h1 className={`inline-block clearfix ${style.bolder}`}>{'Shuttle Service'}</h1>
                    </React.Fragment> : null}
                    <h4 className='orange'>Rs. {convertPrice(price.price, 'PKR')}</h4>
                      <p className={''}>{price.description}</p>
                  </div>
                  </div>
              })
            }
          </div> : null}
          <hr/>
          <div className='col-sm-12 row space-4'>
            <h3 className={`${style.heading} space-4`}>Recommended Destinations For You</h3>
            <div className='row'>
              <div className={'horizontalScrollContainer'}>
              {/* <Fader width={275} maxWidth={1170} unSlickTill={1024} items= */}
                {this.state.locations.map((data, index) => {
                  return index <= 7 ?
                  <div id='tileCol' className='col-sm-3'>
                  <RecommendationTile data={data} />
                  </div> : null
                })}
                {/* ></Fader> */}
              </div>
            </div>
          </div>
          <div className='row space-4'>
            <div id='reviews' className='col-sm-12'>
              <h3 className={`${style.heading} space-4`}>Reviews</h3>
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
          <hr/>
        </div>
      </div>
    </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(PackagePage)