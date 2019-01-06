import React from 'react'
import { connect } from 'react-redux'

import style from './style.css'


class HotelContactCard extends React.Component {
	constructor(props) {
		super(props);
		this.data = {
  } 
}

	render() {
    return (
		<div className={style.contactCard}>
			<div className='clearfix'>				
				<h1 className='pull-left'>Rs. 3000+</h1> 
				<p className='pull-left'>/ per Night</p>
			</div>
    </div>
		)
  }
}

export default connect(store => {
	return {
	}
})(HotelContactCard)