import React from 'react'
import { connect } from 'react-redux'
import HotelContactCard from 'components/HotelContactCard';

import style from './style.css'


class HotelPage extends React.Component {
	constructor(props) {
		super(props);
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
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
      {user: 'Yasser Zubair', image: require('../../../site-specs/sliced-images/recommended-thumb-01.png'), comments: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.'},
    ],
		}
	}

	render() {
    return (
		<div>
      <div className={`space-4 ${style.hotelCovers}`}>
        {
          this.data.hotelCovers.map((image) => {
           return <div className={`bgDiv ${style.coverImages}`} style={{background:`url(${image.url})` }}></div>
        })
        }
      </div>
      <div className="container space-4">
        <div className="row space-4">
          <div className='col-sm-8'>
            <h1>Falettis Hotel Lahore</h1>
            <h4>24 Egerton Road, Lahore, Pakistan</h4>
            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt.
            </p>
            <div className='row'>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>4 guests</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bedroom</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>1 Bath</h4>
              <h4 style={{display: 'inline-block', marginLeft: '20px'}}>2 Beds</h4>
            </div>
          </div>
          <div className={'col-sm-4'}>
            <HotelContactCard/>
          </div>
        </div>
        <div className='row space-4'>
          <div className='col-sm-12'>
            <h1>Tour this hotel</h1>
            <div className='row'>
            {this.data.hotelFeatures.map((image) => {
              return <div className='col-sm-2 space-4'>
                <div className={`bgDiv ${style.featureImage}`} style={{background:`url(${image.url})` }}></div>
                <h4 style={{margin: '10px, 0'}}>{image.name}</h4>
              </div>
            })}
              </div>
              <h4 className='orange'>Explore all 20 photos</h4>
            </div>
          </div>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Amenities</h1>
              <div className='row'>
                {this.data.hotelAmenities.map((image) => {
                  return <div className='col-sm-3 space-4'>
                    <div className={`bgDiv ${style.amenityImage}`} style={{background:`url(${image.url})` }}></div>
                    <h4 style={{margin: '10px, 0'}}>{image.name}</h4>
                  </div>
                })}
              </div>
                <h4 className='orange'>Show all 9 amenities</h4>
            </div>
          </div>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Location</h1>
              <div className='row'>
                <div className='col-sm-12'>
                  <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
                </div>
              </div>
            </div>
          </div>
          <div className='row space-4'>
            <div className='col-sm-12'>
              <h1>Reviews</h1>
              <div className='row'>
                <div className='col-sm-12'>
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
                  {/* <iframe width="100%" height="500" id="gmap_canvas" src="https://maps.google.com/maps?q=university%20of%20san%20francisco&t=&z=13&ie=UTF8&iwloc=&output=embed" frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe> */}
                </div>
              </div>
            </div>
          </div>
          <div className='row space-8'>
          <div className='col-sm-12 space-4'>
            <h1>Recommended Destinations For You</h1>
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
})(HotelPage)