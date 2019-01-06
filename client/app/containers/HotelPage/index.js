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
        <div className="row"/>
        <div className='col-sm-8'>
          <h1>Falettis Hotel Lahore</h1>
          <h4>24 Egerton Road, Lahore, Pakistan</h4>
        </div>
        <div className={'col-sm-4'}>
          <HotelContactCard/>
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