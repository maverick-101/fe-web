import React from 'react'
import { connect } from 'react-redux'
import HotelContactCard from 'components/HotelContactCard';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import axios from 'axios';
import config from 'config';
import StarRatings from 'react-star-ratings';


import style from './style.css'


class PackagePage extends React.Component {
	constructor(props) {
    super(props);
    this.state = {
      activeItem: 'description',
      travelPackage: {},
      fetchedReviews: [],
      disableSubmit: true,
      rating: 5,
    }
    
    // this.weatherWidget = `<iframe id="forecast_embed" frameborder="0" height="245" width="100%" src="https://darksky.net/widget/default/42.360082,-71.05888/us12/en.js?height=500&title=Full Forecast&textColor=333333&bgColor=FFFFFF&skyColor=333&fontFamily=Default&units=us&htColor=333333&ltColor=C7C7C7&displaySum=yes&displayHeader=yes"></iframe>`
    this.images = [
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
		this.data = {
      package: {
        cover: {
          url: require('../../../site-specs/sliced-images/hotel-1.jpg')
        }
      },
			hotelCovers: [
				{name:'3 Days Trip to Hunza Valley', location: 'Hunza Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-1.jpg')},
				{name:'5 Days Trip to Shangrila', location: 'Shangrilla Resorts', price:3000, url: require('../../../site-specs/sliced-images/hotel-2.jpg')},
				{name:'3 Days Trip to Naran Kaghan', location: 'Naran Kaghan Valley', price:3000, url: require('../../../site-specs/sliced-images/hotel-3.jpg')},
    ],
      hotelFeatures : [
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
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
    ],
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
    axios.post(`${config.apiPath}/save/packageRating-save`, {hotelRating: JSON.stringify(obj)} )
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
    console.log(rating)
    this.setState({
      rating,
    })
  }
  
  componentDidMount() {
    console.log(this.props);
    axios.get(`${config.apiPath}/fetchById/packagePage-fetchById/${this.props.params.packageId}`)
		.then((response) => {
      var travelPackage = response.data;
      // var amenityNames = [];
      // console.log('hotel Data', hotel);
      // hotel.hotel_amenities.filter((amenity) => {
      //   if(amenity.value)
      //   {
      //     amenityNames.push(amenity.name.split(' ').join('_').toLocaleLowerCase())
      //     return true;
      //   }
      // })
      // console.log('filtered amenities', amenityNames)
      var packageGallery = travelPackage.gallery.map((image) => {
        return {
          original: image.url,
          thumbnail: image.url,
        }
      })
      this.setState({
        travelPackage,
        packageGallery,
      }, () => {
        this.loadWeatherWidget(travelPackage.latitude,travelPackage.longitude)
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
      {/* <div className={`space-4 ${style.packageCovers}`}>
        <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${this.data.package.cover.url})` }}></div>
      <div className={style.coverInfo}>
        <p className={`inline-block`}>Home</p>
        <p className={'inline-block'}>Packages</p>
        <p className={'inline-block'}>Naltar Valley</p>
      </div>
      </div> */}
      <div className='space-4'>
        <ImageGallery lazyload={true} items={packageGallery} />
      </div>
      <div className="container space-4">
        <div className="row space-4">
          <div className='col-sm-8'>
            {/* <ImageGallery
              items={this.images}
              ref={i => this._imageGallery = i}
              showPlayButton={false}
            /> */}
            {/* <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p> */}
            <h2>Summary</h2>
            <div className='space-4'>
              <span><h4>Day - 1</h4></span>
              <span><h4>Islamabad – Balakot – Naran (250kms/10-11hrs)</h4></span>
              <p>
                We will depart from Islamabad for Naran. Passing through Hassan Abdal, Haripur and Abbottabad we will reach Mansehra. After a brief stop for lunch in Mansehra, we will resume our drive and reach Balakot, the gateway to Kaghan Valley. Continuing our drive, we will reach Naran and check in to hotel for night stay.
              </p>
            </div>
            <div className='space-4'>
              <span><h4>Day - 2</h4></span>
              <span><h4>Islamabad – Balakot – Naran (250kms/10-11hrs)</h4></span>
              <p>
                We will depart from Islamabad for Naran. Passing through Hassan Abdal, Haripur and Abbottabad we will reach Mansehra. After a brief stop for lunch in Mansehra, we will resume our drive and reach Balakot, the gateway to Kaghan Valley. Continuing our drive, we will reach Naran and check in to hotel for night stay.
              </p>
            </div>
            <div className='space-4'>
              <span><h4>Day - 3</h4></span>
              <span><h4>Islamabad – Balakot – Naran (250kms/10-11hrs)</h4></span>
              <p>
                We will depart from Islamabad for Naran. Passing through Hassan Abdal, Haripur and Abbottabad we will reach Mansehra. After a brief stop for lunch in Mansehra, we will resume our drive and reach Balakot, the gateway to Kaghan Valley. Continuing our drive, we will reach Naran and check in to hotel for night stay.
              </p>
            </div>
            <div className='space-4'>
              <span><h4>Day - 4</h4></span>
              <span><h4>Islamabad – Balakot – Naran (250kms/10-11hrs)</h4></span>
              <p>
                We will depart from Islamabad for Naran. Passing through Hassan Abdal, Haripur and Abbottabad we will reach Mansehra. After a brief stop for lunch in Mansehra, we will resume our drive and reach Balakot, the gateway to Kaghan Valley. Continuing our drive, we will reach Naran and check in to hotel for night stay.
              </p>
            </div>
          </div>
          <div className={'col-sm-4'}>
            <HotelContactCard/>
          </div>
        </div>
        <div>
          <div className={`${style.tab} space-4 row`}>
            <div className={`${style.tabsContainer}`}>
              <p onClick={() => {this.scrollToDiv('description')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'description' ? style.activeItem : null}`}>Description</p>
              <p onClick={() => {this.scrollToDiv('location')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'location' ? style.activeItem : null}`}>Location</p>
              <p onClick={() => {this.scrollToDiv('guide')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'guide' ? style.activeItem : null}`}>Travel Guide</p>
              <p onClick={() => {this.scrollToDiv('pricing')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'reviews' ? style.activeItem : null}`}>Pricing</p>
              <p onClick={() => {this.scrollToDiv('reviews')}} className={`inline-block ${style.tabItem} ${this.state.activeItem == 'reviews' ? style.activeItem : null}`}>Reviews</p>
            </div>
          </div>
        </div>
        <div className='row space-4'>
          <div id='description' className='space-4'>
            <h2 className={`${style.heading} space-4`}>Description</h2>
            <div dangerouslySetInnerHTML={{__html: travelPackage.description}}></div>
            {/* <h2 className={`${style.heading} space-4`}>Description</h2>
            <h4>Overview</h4>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architectonventore veritatis et quasi architect onventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h5>Overview</h5>
            <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis iste natus Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,  error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis iste natus Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam,  error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p> */}
          </div>
          <hr/>
          {/* <div id='location' className='space-4'>
            <h2 className={`${style.heading} space-4`}>Location</h2>
              <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
          </div> */}
          <div id='location' className='row space-4'>
            <div className='col-sm-12'>
              <h1>Location</h1>
              <div className='row'>
                <div className='col-sm-12'>
                  <iframe width="100%" height="500" id="gmap_canvas" src={`https://www.google.com/maps/embed/v1/view?zoom=17&center=${travelPackage.latitude},${travelPackage.longitude}&key=AIzaSyC9eODMR7SDxA33WxFzyR1-r7ETFx5PaLw`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <hr/>
          <div id='guide' className='space-4'>
            <h2 className={`${style.heading} space-4`}>Travel Guide</h2>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia vnatus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia viste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <div>
              {/* <div dangerouslySetInnerHTML={{__html: this.weatherWidget}}></div> */}
              <div id='customize-script-container'></div>
            </div>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia vodit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <h5>Overview</h5>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia vnatus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia vlores eos qui ratione voluptatem sequi nesciunt.
            </p>
          </div>
          <hr/>
          <div className='row space-4'>
            <div id='reviews' className='col-sm-12'>
              <h2 className={`${style.heading} space-4`}>Reviews</h2>
              <div className='row'>
                <div className='col-sm-12'>
                  {/* {
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
                  } */}
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
          <hr/>
          <div className='row col-sm-12 space-4'>
            <h2 className={`${style.heading} space-4`}>Recommended Destinations For You</h2>
            <div className='row'>
            {this.data.hotelFeatures.map((image) => {
              return <div className='col-sm-2 space-4'>
                <div className={`bgDiv ${style.featureImage}`} style={{background:`url(${image.url})` }}></div>
                <h4 style={{margin: '10px, 0'}}>{image.name}</h4>
              </div>
            })}
              </div>
            </div>
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